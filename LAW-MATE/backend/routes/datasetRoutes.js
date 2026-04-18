const express = require('express');
const router = express.Router();

// Mock dataset statistics - in production, this would come from a real database
const datasetStats = {
  total_cases: 15420,
  last_updated: new Date().toISOString(),
  top_case_types: [
    { type: 'property_dispute', count: 3240 },
    { type: 'labor_law', count: 2890 },
    { type: 'family_law', count: 2650 },
    { type: 'criminal_law', count: 2380 },
    { type: 'contract_dispute', count: 2150 },
    { type: 'consumer_rights', count: 2110 }
  ],
  distribution: [
    { name: 'Low', value: 45, color: '#10b981' },
    { name: 'Medium', value: 35, color: '#f59e0b' },
    { name: 'High', value: 20, color: '#ef4444' }
  ]
};

// GET /api/dataset/stats
router.get('/stats', (req, res) => {
  try {
    // Simulate real-time updates by adding some randomness
    const updatedStats = {
      ...datasetStats,
      total_cases: datasetStats.total_cases + Math.floor(Math.random() * 10),
      last_updated: new Date().toISOString()
    };

    res.json(updatedStats);
  } catch (error) {
    console.error('Error fetching dataset stats:', error);
    res.status(500).json({ error: 'Failed to fetch dataset statistics' });
  }
});

module.exports = router;