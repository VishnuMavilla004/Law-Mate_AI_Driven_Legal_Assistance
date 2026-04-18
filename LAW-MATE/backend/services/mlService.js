/**
 * ML Service Integration for LAW-MATE
 * Handles communication with the Python ML service
 */

const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Classify a legal issue into categories
 * @param {string} text - The legal issue description
 * @returns {Promise<{category: string, confidence: number}>}
 */
async function classifyLegalIssue(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/classify`, {
      text: text
    }, {
      timeout: 5000 // 5 second timeout
    });

    return {
      category: response.data.category,
      confidence: response.data.confidence
    };
  } catch (error) {
    console.warn('ML classification service unavailable:', error.message);
    // Return fallback values
    return {
      category: 'general_law',
      confidence: 0.5
    };
  }
}

/**
 * Predict severity score for a legal issue
 * @param {string} text - The legal issue description
 * @returns {Promise<{severity_score: number, risk_level: string}>}
 */
async function predictSeverity(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/severity`, {
      text: text
    }, {
      timeout: 5000
    });

    return {
      severity_score: response.data.severity_score,
      risk_level: response.data.risk_level
    };
  } catch (error) {
    console.warn('ML severity service unavailable:', error.message);
    // Return fallback values
    return {
      severity_score: 0.5,
      risk_level: 'Medium'
    };
  }
}

/**
 * Find similar legal cases
 * @param {string} text - The legal issue description
 * @returns {Promise<{similar_cases: string[]}>}
 */
async function findSimilarCases(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/similarity`, {
      text: text,
      top_k: 3
    }, {
      timeout: 5000
    });

    return {
      similar_cases: response.data.similar_cases
    };
  } catch (error) {
    console.warn('ML similarity service unavailable:', error.message);
    // Return fallback values
    return {
      similar_cases: []
    };
  }
}

/**
 * Get complete ML analysis
 * @param {string} text - The legal issue description
 * @returns {Promise<Object>} - Combined ML results
 */
async function getCompleteAnalysis(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/analyze`, {
      text: text
    }, {
      timeout: 10000 // 10 second timeout for complete analysis
    });

    return response.data;
  } catch (error) {
    console.warn('ML analysis service unavailable:', error.message);
    // Return fallback values
    return {
      category: 'general_law',
      category_confidence: 0.5,
      severity_score: 0.5,
      risk_level: 'Medium',
      similar_cases: []
    };
  }
}

module.exports = {
  classifyLegalIssue,
  predictSeverity,
  findSimilarCases,
  getCompleteAnalysis
};