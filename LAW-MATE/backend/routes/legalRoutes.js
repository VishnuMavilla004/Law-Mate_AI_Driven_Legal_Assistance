const express = require('express');
const router = express.Router();
const { analyzeIssue, getHistory, pastAnalysis, generateDocument } = require('../controllers/legalController');

router.post('/analyze', analyzeIssue);
router.get('/history', getHistory);
router.post('/past-analysis', pastAnalysis);
router.post('/generate-document', generateDocument);

module.exports = router;
