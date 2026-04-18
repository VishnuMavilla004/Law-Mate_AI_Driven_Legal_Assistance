const express = require('express');
const router = express.Router();
const { checkEligibility, syncSchemesRoute } = require('../controllers/schemeController');

router.post('/check-eligibility', checkEligibility);
router.post('/sync', syncSchemesRoute);

module.exports = router;
