const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('craftmypearlcryst_db', 'root', '', {
  // host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Aiven SSL connections
    }
  }
});

module.exports = sequelize;