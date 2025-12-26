const app = require('./app');
const { config } = require('./config');
const connectDatabase = require('./database/connection');

try {
  connectDatabase();
  app.listen(config.APPLICATION_PORT, () => {
    console.log(`Server is listening on port: ${config.APPLICATION_PORT}`);
  });
} catch (error) {
  console.error('Failed to start server', error);
  process.exit(1);
}
