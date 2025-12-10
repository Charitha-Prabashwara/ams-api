const mongoose = require('mongoose');
const { config } = require('../config');

const DB_connect = async () => {
  try {
    await mongoose.connect(config.DB_MONGODB_URI + config.DB_MONGODB_DATABASE);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process on DB connection failure
  }
};

module.exports = { mongoose, DB_connect };
