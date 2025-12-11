const express = require('express');
const app = express();
const { ErrorTranslator, ErrorHandler } = require('./middleware');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { DB_connect } = require('./database/db');
const envTypes = require('./config/EnvTypes')
const corsMiddleware = require('./cors/cors')




DB_connect(); // Database connection

app.use(compression({threshold: 1024}));

app.use(corsMiddleware);

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));


if (process.env.NODE_ENV !== envTypes.PRODUCTION) {
 const swaggerUi = require('swagger-ui-express');
 const swaggerJsDoc = require('swagger-jsdoc');
 const swaggerOptions = require('./docs/swagger/swaggerOptions');
 const swaggerDocs = swaggerJsDoc(swaggerOptions);
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customSiteTitle: "AMS API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
 }));

}

const { base_router, adminRouter, departmentRouter } = require('./routes');

app.use('/api/v1/', base_router);
app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/department/', departmentRouter);

app.use(ErrorTranslator);
app.use(ErrorHandler);
module.exports = app;
