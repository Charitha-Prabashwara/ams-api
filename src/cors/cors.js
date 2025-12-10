const cors = require('cors');
const {NotAllowedRequestByCorsError} = require('../errors')
const getAllowedOrigins = require('./getAllowedOrigins')
const getAllowedMethods = require('./getAllowedMethods')
const getAllowedHeaders = require('./getAllowedHeaders')

const allowedOrigins = new Set(getAllowedOrigins())
const allowedMethods = getAllowedMethods()
const allowedHeaders = getAllowedHeaders()

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new NotAllowedRequestByCorsError(origin));
    }
  },
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  credentials: true,
};
module.exports = cors(corsOptions)


