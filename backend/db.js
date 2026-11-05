const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('craftmypearlcryst_db', 'root', '', {
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Aiven SSL connections
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;