const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
 user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_no: {
    type: DataTypes.STRING,
  },
  user_type: {
    type: DataTypes.STRING,
    defaultValue: 'customer'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports =  User;