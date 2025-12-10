const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const Redis = require('ioredis');
const compression = require('compression');
const { DB_connect } = require('./database/db');
const envTypes = require('./config/EnvTypes')
// Database connection
DB_connect();

app.use(
  compression({
    threshold: 1024, // compress only if response > 1 KB
  }),
);

// const redis = new Redis({
//   host: '192.168.1.100',   // Replace with your Redis server IP
//   port: 6379,              // Replace with your Redis port if different
//   password: 'yourpassword' // If Redis is password-protected
// });

// //Uncomment this when using local development

const allowedOrigins = [
  "http://localhost:3000"
];

// // // CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Token"
  ],
  credentials: true,
};

app.use(cors(corsOptions));
// //this

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// // Swagger setup
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

// // Routes imports
const { base_router, adminRouter, departmentRouter } = require('./routes');

// // Routes
app.use('/api/v1/', base_router);
app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/department/', departmentRouter);

module.exports = app;
