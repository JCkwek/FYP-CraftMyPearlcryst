const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('craftmypearlcryst_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;