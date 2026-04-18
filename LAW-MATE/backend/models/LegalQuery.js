const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LegalQuery = sequelize.define('LegalQuery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  query_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ml_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  analysis_result: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  tableName: 'legal_queries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = LegalQuery;
