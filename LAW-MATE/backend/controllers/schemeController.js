const Scheme = require('../models/Scheme');
const { Op } = require('sequelize');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch schemes from live API
async function fetchSchemesFromAPI() {
  try {
    // Scrape from MyGov website
    const response = await axios.get('https://www.mygov.in/group-issue/schemes-programmes');
    const $ = cheerio.load(response.data);
    
    const schemes = [];
    // Assuming the schemes are in a list, adjust selectors based on page structure
    $('.scheme-item').each((index, element) => {
      const name = $(element).find('.scheme-title').text().trim();
      const description = $(element).find('.scheme-description').text().trim();
      const link = $(element).find('a').attr('href');
      if (name) {
        schemes.push({
          name,
          description,
          official_link: link || '#',
          category: 'General', // Default
          income_limit: null,
          state: 'All India',
          occupation: 'Any',
          benefits: description,
        });
      }
    });
    
    // If no schemes found, fallback to static data
    if (schemes.length === 0) {
      return [
        {
          name: 'Pradhan Mantri Kisan Samman Nidhi',
          description: 'Income support for farmers',
          official_link: 'https://pmkisan.gov.in/',
          category: 'General',
          income_limit: 600000,
          state: 'All India',
          occupation: 'Farmer',
          benefits: 'Rs. 6,000 per year',
        },
        {
          name: 'Ayushman Bharat',
          description: 'Health insurance scheme',
          official_link: 'https://pmjay.gov.in/',
          category: 'General',
          income_limit: 500000,
          state: 'All India',
          occupation: 'Any',
          benefits: 'Up to Rs. 5 lakh coverage',
        },
        // Add more fallback schemes
      ];
    }
    
    return schemes;
  } catch (error) {
    console.error('Error fetching schemes from API:', error);
    // Fallback to static data
    return [
      {
        name: 'Pradhan Mantri Kisan Samman Nidhi',
        description: 'Income support for farmers',
        official_link: 'https://pmkisan.gov.in/',
        category: 'General',
        income_limit: 600000,
        state: 'All India',
        occupation: 'Farmer',
        benefits: 'Rs. 6,000 per year',
      },
      {
        name: 'Ayushman Bharat',
        description: 'Health insurance scheme',
        official_link: 'https://pmjay.gov.in/',
        category: 'General',
        income_limit: 500000,
        state: 'All India',
        occupation: 'Any',
        benefits: 'Up to Rs. 5 lakh coverage',
      },
    ];
  }
}

// Function to sync schemes from API to database
async function syncSchemes() {
  try {
    const schemes = await fetchSchemesFromAPI();
    if (schemes.length > 0) {
      // Clear existing schemes
      await Scheme.destroy({ where: {} });
      // Insert new schemes
      await Scheme.bulkCreate(schemes.map(scheme => ({
        scheme_name: scheme.name,
        category: scheme.category || 'General',
        income_limit: scheme.income_limit || null,
        state: scheme.state || 'All India',
        occupation: scheme.occupation || 'Any',
        benefits: scheme.benefits,
        official_link: scheme.official_link,
      })));
      console.log('Schemes synced from API');
    }
  } catch (error) {
    console.error('Error syncing schemes:', error);
  }
}

// POST /api/schemes/check-eligibility
async function checkEligibility(req, res) {
  try {
    const { income, category, state, occupation } = req.body;

    // Check if database has schemes, if not, sync from API
    const count = await Scheme.count();
    if (count === 0) {
      await syncSchemes();
    }

    // build query using Sequelize where clauses
    const where = {};
    if (category) where.category = category;
    if (state) where.state = state;
    if (occupation) where.occupation = occupation;
    if (income !== undefined) where.income_limit = { [Op.gte]: income };

    const schemes = await Scheme.findAll({ where });
    res.json(schemes);
  } catch (err) {
    console.error('Error checking eligibility', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/schemes/sync
async function syncSchemesRoute(req, res) {
  try {
    await syncSchemes();
    res.json({ message: 'Schemes synced successfully' });
  } catch (err) {
    console.error('Error syncing schemes', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  checkEligibility,
  syncSchemesRoute,
};
