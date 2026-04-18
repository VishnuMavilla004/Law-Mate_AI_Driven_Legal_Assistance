const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scheme = sequelize.define('Scheme', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  scheme_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  income_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  benefits: {
    type: DataTypes.TEXT,
  },
  official_link: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'gov_schemes',
  timestamps: false,
});

module.exports = Scheme;
