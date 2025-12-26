const mongoose = require('mongoose');
const { config } = require('../config');

module.exports = async () => {
  await mongoose.connect(config.DB_MONGODB_URI + config.DB_MONGODB_DATABASE);
  console.info('Database connection successfully')
};;
