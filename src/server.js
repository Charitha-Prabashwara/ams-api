const app = require('./app');
const { config } = require('./config');

const { ErrorTranslator, ErrorHandler } = require('./middleware');

app.use(ErrorTranslator);
app.use(ErrorHandler);

app.listen(config.APPLICATION_PORT, () => {
  console.log(`Server is listening on port: ${config.APPLICATION_PORT}`);
});
