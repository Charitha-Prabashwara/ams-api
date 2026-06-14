const express = require('express');
const base_router = express.Router();

base_router.get('/', async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'api/v1 is working...',
  });
});

module.exports = base_router;

