import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Search,
  BarChart3,
  Clock,
  Target,
  Zap,
  FileText,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { predictCaseType, predictSeverity, findSimilarCases, getDatasetStats } from '../services/api';

interface MLResult {
  category?: string;
  confidence?: number;
  severity_score?: number;
  risk_level?: string;
  similar_cases?: string[];
  keywords?: string[];
  is_heuristic?: boolean;
}

interface DatasetStats {
  total_cases: number;
  last_updated: string;
  top_case_types: Array<{ type: string; count: number }>;
  distribution: Array<{ name: string; value: number; color: string }>;
  model_accuracy?: {
    classification: number;
    severity: number;
    similarity: string;
  };
}

interface ModelMetrics {
  classification_accuracy: number;
  severity_mse: number;
  severity_r2: number;
  total_predictions: number;
}

const MLInsightsDashboard: React.FC = () => {
  const [caseText, setCaseText] = useState('');
  const [results, setResults] = useState<MLResult>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'insights'>('analysis');
  const [predictionHistory, setPredictionHistory] = useState<Array<{
    id: string;
    text: string;
    category: string;
    severity: number;
    timestamp: Date;
  }>>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    classification_accuracy: 0.476,
    severity_mse: 0.0,
    severity_r2: 0.723,
    total_predictions: 0
  });
  const [systemStatus, setSystemStatus] = useState({
    ml_service: false,
    backend_api: false,
    frontend: true
  });

  const checkSystemStatus = async () => {
    const status = { ml_service: false, backend_api: false, frontend: true };

    try {
      const mlResponse = await fetch('http://localhost:8000/health');
      status.ml_service = mlResponse.ok;
    } catch (e) {
      console.log('ML service check failed');
    }

    try {
      const apiResponse = await fetch('http://localhost:5001/api/health');
      status.backend_api = apiResponse.ok;
    } catch (e) {
      console.log('Backend API check failed');
    }

    setSystemStatus(status);
  };

  useEffect(() => {
    checkSystemStatus();
    fetchDatasetStats();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Clear results when case text changes
  useEffect(() => {
    if (caseText.trim() === '') {
      setResults({});
      setErrorMessage(null);
    }
  }, [caseText]);

  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction - in a real implementation, this would use NLP
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'my', 'has', 'have', 'had', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being']);
    const keywords = words.filter(word => word.length > 3 && !commonWords.has(word));
    return [...new Set(keywords)].slice(0, 5); // Return up to 5 unique keywords
  };

  const fetchDatasetStats = async () => {
    try {
      const data = await getDatasetStats();
      setDatasetStats(data);
    } catch (error) {
      console.error('Failed to fetch dataset stats:', error);
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePredictCaseType = async () => {
    if (!caseText.trim()) return;

    setLoading(prev => ({ ...prev, type: true }));
    setErrorMessage(null);

    try {
      const data = await predictCaseType(caseText);
      const keywords = extractKeywords(caseText);

      setResults({
        category: data.category,
        confidence: data.confidence,
        is_heuristic: data.is_heuristic,
        keywords,
        severity_score: undefined,
        risk_level: undefined,
        similar_cases: []
      });

      // Do not add history until severity is predicted in standalone mode (prevents mixed results)
    } catch (error: any) {
      console.error('Prediction failed:', error);
      setErrorMessage(error?.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, type: false }));
    }
  };

  const handlePredictSeverity = async () => {
    if (!caseText.trim()) return;

    setLoading(prev => ({ ...prev, severity: true }));
    setErrorMessage(null);

    try {
      const data = await predictSeverity(caseText);

      const updatedResults = {
        ...results,
        severity_score: data.severity_score,
        risk_level: data.risk_level
      };

      setResults(updatedResults);

      if (updatedResults.category) {
        addToHistory(caseText, updatedResults.category, updatedResults.severity_score!);
      }
    } catch (error: any) {
      console.error('Severity prediction failed:', error);
      setErrorMessage(error?.message || 'Severity prediction failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, severity: false }));
    }
  };

  const handleFindSimilarCases = async () => {
    if (!caseText.trim()) return;

    setLoading(prev => ({ ...prev, similar: true }));
    setErrorMessage(null);

    try {
      const data = await findSimilarCases(caseText, 5);

      setResults(prev => ({
        ...prev,
        similar_cases: data.similar_cases
      }));
    } catch (error: any) {
      console.error('Similarity search failed:', error);
      setErrorMessage(error?.message || 'Similarity search failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, similar: false }));
    }
  };

  const handleAnalyzeCase = async () => {
    if (!caseText.trim()) return;

    setLoading(prev => ({ ...prev, analysis: true }));
    setErrorMessage(null);

    try {
      const [typeData, severityData, similarData] = await Promise.all([
        predictCaseType(caseText),
        predictSeverity(caseText),
        findSimilarCases(caseText, 5)
      ]);

      const keywords = extractKeywords(caseText);

      const updatedResults = {
        category: typeData.category,
        confidence: typeData.confidence,
        is_heuristic: typeData.is_heuristic,
        severity_score: severityData.severity_score,
        risk_level: severityData.risk_level,
        similar_cases: similarData.similar_cases,
        keywords
      };

      setResults(updatedResults);
      addToHistory(caseText, updatedResults.category, updatedResults.severity_score);
    } catch (error: any) {
      console.error('Case analysis failed:', error);
      setErrorMessage(error?.message || 'Case analysis failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const addToHistory = (text: string, category: string, severity: number) => {
    const newPrediction = {
      id: Date.now().toString(),
      text: text.length > 50 ? text.substring(0, 50) + '...' : text,
      category,
      severity,
      timestamp: new Date()
    };
    setPredictionHistory(prev => [newPrediction, ...prev.slice(0, 9)]); // Keep last 10
    setModelMetrics(prev => ({ ...prev, total_predictions: prev.total_predictions + 1 }));
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'High': return 'text-red-500 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const ConfidenceBar = ({ confidence }: { confidence?: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(confidence || 0) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20"
          >
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ML Insights Dashboard
            </h1>
          </motion.div>
          <p className="text-gray-600 mt-4 text-lg">Advanced Legal Case Analysis Powered by Machine Learning</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Case Analysis
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dataset Insights
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analysis' ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Input Panel */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Case Description
                  </h2>
                  <textarea
                    value={caseText}
                    onChange={(e) => setCaseText(e.target.value)}
                    placeholder="Describe your legal case in detail..."
                    className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm"
                  />
                  {caseText && (
                    <div className="mt-2 text-sm text-gray-600">
                      Current input: "{caseText.length > 50 ? caseText.substring(0, 50) + '...' : caseText}"
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyzeCase}
                    disabled={loading.analysis || !caseText.trim()}
                    className="col-span-1 bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading.analysis ? (
                      <Activity className="w-5 h-5 animate-spin" />
                    ) : (
                      <BarChart3 className="w-5 h-5" />
                    )}
                    Analyze Case
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePredictCaseType}
                    disabled={loading.type || !caseText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading.type ? (
                      <Activity className="w-5 h-5 animate-spin" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                    Predict Case Type
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePredictSeverity}
                    disabled={loading.severity || !caseText.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading.severity ? (
                      <Activity className="w-5 h-5 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    Predict Severity
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFindSimilarCases}
                    disabled={loading.similar || !caseText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading.similar ? (
                      <Activity className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Find Similar Cases
                  </motion.button>
                </div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-400 text-red-800 p-4 rounded-lg mb-4 shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Error Occurred</h4>
                        <p className="text-sm">{errorMessage}</p>
                        <p className="text-xs text-red-600 mt-2">
                          📌 Make sure both the ML Service (port 8000) and Backend API (port 5001) are running.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCaseText("My employer has not paid my salary for three months despite multiple reminders.")}
                      className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                    >
                      <div className="text-sm font-medium text-blue-800">Labor Dispute</div>
                      <div className="text-xs text-blue-600">Salary not paid</div>
                    </button>
                    <button
                      onClick={() => setCaseText("My neighbor is playing loud music late at night disturbing the peace.")}
                      className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                    >
                      <div className="text-sm font-medium text-green-800">Noise Complaint</div>
                      <div className="text-xs text-green-600">Disturbing peace</div>
                    </button>
                    <button
                      onClick={() => setCaseText("I was involved in a car accident and the other driver fled the scene.")}
                      className="p-3 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
                    >
                      <div className="text-sm font-medium text-red-800">Hit & Run</div>
                      <div className="text-xs text-red-600">Traffic accident</div>
                    </button>
                    <button
                      onClick={() => setCaseText("My landlord refuses to return my security deposit without valid reason.")}
                      className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                    >
                      <div className="text-sm font-medium text-purple-800">Property Dispute</div>
                      <div className="text-xs text-purple-600">Security deposit</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="space-y-6">
                {/* Case Type Result */}
                {results.category && (
                  <motion.div
                    key={`category-${results.category}-${results.confidence}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold">Case Classification</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{results.category}</span>
                          {results.is_heuristic && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Heuristic
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{((results.confidence || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <ConfidenceBar confidence={results.confidence} />
                      </div>
                      {results.keywords && results.keywords.length > 0 && (
                        <div>
                          <span className="text-gray-600 block mb-2">Key Terms:</span>
                          <div className="flex flex-wrap gap-2">
                            {results.keywords.map((keyword, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Severity Result */}
                {results.severity_score !== undefined && (
                  <motion.div
                    key={`severity-${results.severity_score}-${results.risk_level}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                      <h3 className="text-lg font-semibold">Severity Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Severity Score:</span>
                        <span className="font-medium">{(results.severity_score * 100).toFixed(1)}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(results.risk_level)}`}>
                          {results.risk_level}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${
                            results.risk_level === 'High' ? 'bg-red-500' :
                            results.risk_level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${results.severity_score * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Similar Cases Result */}
                {results.similar_cases && results.similar_cases.length > 0 && (
                  <motion.div
                    key={`similar-${results.similar_cases.length}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold">Similar Cases</h3>
                    </div>
                    <div className="space-y-3">
                      {results.similar_cases.map((case_text, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <p className="text-sm text-gray-700">{case_text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Prediction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Recent Predictions
                </h3>
                {predictionHistory.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {predictionHistory.map((prediction) => (
                      <div key={prediction.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-700 font-medium">{prediction.text}</p>
                          <span className="text-xs text-gray-500">
                            {prediction.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {prediction.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            prediction.severity >= 0.8 ? 'bg-red-100 text-red-800' :
                            prediction.severity >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            Severity: {(prediction.severity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No predictions made yet. Try analyzing a case above!</p>
                )}
              </motion.div>

              {/* Model Insights */}
              {results.category && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold">AI Model Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Prediction Confidence</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <ConfidenceBar confidence={results.confidence} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {((results.confidence || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors Influencing Prediction</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {results.keywords && results.keywords.map((keyword, index) => (
                          <div key={index} className="bg-indigo-50 text-indigo-800 px-3 py-2 rounded-lg text-sm text-center">
                            "{keyword}"
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Model Performance</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Classification Accuracy: {(modelMetrics.classification_accuracy * 100).toFixed(1)}%</div>
                        <div>Severity Prediction R²: {(modelMetrics.severity_r2 * 100).toFixed(1)}%</div>
                        <div>Training Data: {datasetStats?.total_cases || 0} cases</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  System Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${systemStatus.frontend ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">Frontend</div>
                      <div className="text-xs text-gray-600">React Dashboard</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${systemStatus.backend_api ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">Backend API</div>
                      <div className="text-xs text-gray-600">Node.js Server</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${systemStatus.ml_service ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">ML Service</div>
                      <div className="text-xs text-gray-600">Flask AI Models</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={checkSystemStatus}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg transition-colors"
                  >
                    Refresh Status
                  </button>
                </div>
              </motion.div>

              {/* Dataset Overview */}
              {datasetStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold">Total Cases</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{datasetStats.total_cases.toLocaleString()}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold">Last Updated</h3>
                    </div>
                    <p className="text-lg font-medium text-green-600">{new Date(datasetStats.last_updated).toLocaleDateString()}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold">Top Category</h3>
                    </div>
                    <p className="text-lg font-medium text-purple-600 capitalize">
                      {datasetStats.top_case_types[0]?.type || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">{datasetStats.top_case_types[0]?.count || 0} cases</p>
                  </motion.div>
                </div>
              )}

              {/* Model Performance Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Model Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {modelMetrics.classification_accuracy.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">Classification Accuracy</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${modelMetrics.classification_accuracy * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {modelMetrics.severity_r2.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">Severity R² Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${modelMetrics.severity_r2 * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {modelMetrics.total_predictions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Predictions Made</div>
                    <div className="text-xs text-gray-500 mt-2">Real-time counter</div>
                  </div>
                </div>
              </motion.div>
                {/* Case Type Distribution */}
                {datasetStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <h3 className="text-lg font-semibold mb-6">Case Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={datasetStats.top_case_types}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* Severity Distribution */}
                {datasetStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <h3 className="text-lg font-semibold mb-6">Severity Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={datasetStats.distribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datasetStats.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export { MLInsightsDashboard };