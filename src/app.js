const morgan = require('./middleware/morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');

const app = express();
const { ErrorTranslator, ErrorHandler } = require('./middleware');
const corsMiddleware = require('./cors/cors')
const routes = require('./routes')
const swagger = require('../src/middleware/swagger')
const requestTiming = require('./middleware/requestTiming')
const requestLogger = require('./middleware/morganRaw')
app.set('trust proxy', true);
app.use(requestTiming)
app.use(compression({threshold: 1024}));
app.use(corsMiddleware);
app.use(requestLogger)
morgan(app); // remove in build
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

swagger(app)
routes(app)

app.use(ErrorTranslator);
app.use(ErrorHandler);

module.exports = app;
