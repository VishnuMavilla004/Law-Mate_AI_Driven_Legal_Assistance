const LegalQuery = require('../models/LegalQuery');
const gemini = require('../services/geminiService');
const mlService = require('../services/mlService');

// POST /api/legal/analyze
async function analyzeIssue(req, res) {
  try {
    const { query, category, imageDataUrl } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query text is required' });
    }

    const effectiveCategory = category || 'General / Other';

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key') {
      // developer forgot to configure the key
      console.warn('GEMINI_API_KEY not set, returning stub response');
      const stub = {
        summary: 'No API key configured; returning sample response.',
        severity: 'low',
        confidence: 0,
        confidenceReason: '',
        lawSuggestions: [],
        rights: [],
        nextSteps: [],
        documentSuggestions: [],
        // ML results (fallback values)
        ml_category: 'general_law',
        ml_category_confidence: 0.5,
        ml_severity_score: 0.5,
        ml_risk_level: 'Medium',
        similar_cases: []
      };
      return res.json(stub);
    }

    // Get ML analysis
    console.log('Getting ML analysis...');
    let mlResults;
    try {
      mlResults = await mlService.getCompleteAnalysis(query);
    } catch (mlError) {
      console.warn('ML service unavailable, using defaults:', mlError.message);
      mlResults = {
        category: effectiveCategory,
        confidence: 0.5,
        severity_score: 0.5,
        risk_level: 'Medium',
        similar_cases: []
      };
    }

    // Use ML-detected category for better Gemini analysis, fallback to user category
    const analysisCategory = mlResults.category || effectiveCategory;

    // send to Gemini using the ML-detected category for additional context
    let analysis;
    try {
      analysis = await gemini.analyzeLegalIssue(analysisCategory, query, imageDataUrl);
    } catch (geminiError) {
      console.warn('Gemini API failed, using mock response:', geminiError.message);
      analysis = {
        summary: `AI analysis unavailable: ${geminiError.message}. Please check API key and backend logs for details.`,
        severity: 'Medium',
        confidence: 50,
        confidenceReason: 'Fallback response due to API issues',
        lawSuggestions: [],
        rights: ['Please consult a legal professional for accurate advice'],
        nextSteps: ['Contact a lawyer or legal aid service'],
        documentSuggestions: []
      };
    }

    // Combine results
    const combinedResult = {
      ...analysis,
      ml_category: mlResults.category,
      ml_category_confidence: mlResults.category_confidence,
      ml_severity_score: mlResults.severity_score,
      ml_risk_level: mlResults.risk_level,
      similar_cases: mlResults.similar_cases
    };

    // store in database
    const record = await LegalQuery.create({
      query_text: query,
      category: effectiveCategory,
      ml_category: mlResults.category,
      analysis_result: combinedResult,
    });

    return res.json(combinedResult);
  } catch (err) {
    console.error('Error analyzing legal issue', err);
    const message = err && err.message ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

// GET /api/legal/history
async function getHistory(req, res) {
  try {
    const records = await LegalQuery.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(records);
  } catch (err) {
    console.error('Error fetching history', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/legal/past-analysis
async function pastAnalysis(req, res) {
  try {
    const { incident, incidentYear } = req.body;
    if (!incident || !incidentYear) {
      return res.status(400).json({ error: 'incident and incidentYear required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key') {
      console.warn('GEMINI_API_KEY not set, returning stub past-analysis');
      return res.json({
        analysisThen: 'N/A',
        analysisNow: 'N/A',
        legalChanges: [],
      });
    }

    const analysis = await gemini.analyzePastIncident(incident, incidentYear);
    res.json(analysis);
  } catch (err) {
    console.error('Error performing past analysis', err);
    const message = err && err.message ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

// POST /api/legal/generate-document
async function generateDocument(req, res) {
  try {
    const { docType, analysis, userDetails, additionalDetails } = req.body;
    
    if (!docType || !analysis || !userDetails) {
      return res.status(400).json({ error: 'Document type, analysis, and user details are required' });
    }

    const document = await gemini.generateDocument(docType, analysis, userDetails, additionalDetails || '');
    res.json({ document });
  } catch (err) {
    console.error('Error generating document', err);
    const message = err && err.message ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

module.exports = {
  analyzeIssue,
  getHistory,
  pastAnalysis,
  generateDocument,
};
