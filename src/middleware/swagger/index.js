module.exports = (app) => {
  if (process.env.NODE_ENV === 'production') return;

  const swaggerUi = require('swagger-ui-express');
  const swaggerJsDoc = require('swagger-jsdoc');
  const swaggerOptions = require('./swaggerOptions');

  const swaggerDocs = swaggerJsDoc(swaggerOptions);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      customSiteTitle: 'AMS API Documentation',
      customCss: '.swagger-ui .topbar { display: none }'
    })
  );
};
