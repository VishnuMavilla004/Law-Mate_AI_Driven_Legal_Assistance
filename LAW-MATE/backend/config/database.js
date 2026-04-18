const { Sequelize } = require('sequelize');
require('dotenv').config();

// Prefer a PostgreSQL URL for production, but fall back to a local SQLite file
// when DATABASE_URL is missing.  This makes it easy to run the backend for
// development without installing a separate database server.

// treat a clearly placeholder URL like the example in `.env` as "missing" so
// that someone can clone the repo and run with sqlite immediately.
const rawUrl = process.env.DATABASE_URL || '';
const isPlaceholderUrl = rawUrl.includes('username:') && rawUrl.includes('password');
const usePostgres = rawUrl && !isPlaceholderUrl;

let sequelize;
if (usePostgres) {
  sequelize = new Sequelize(rawUrl, {
    dialect: 'postgres',
    logging: false, // set to console.log to see SQL
  });
} else {
  // development / demo fallback
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
