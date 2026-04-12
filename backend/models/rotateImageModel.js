const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RotatingImage = sequelize.define('RotatingImage', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'rotating_images',
  timestamps: false 
});

module.exports = { RotatingImage };