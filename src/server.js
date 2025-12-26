const app = require('./app');
const { config } = require('./config');
const { DB_connect } = require('./database/db');


try {
  DB_connect();
  app.listen(config.APPLICATION_PORT, () => {
    console.log(`Server is listening on port: ${config.APPLICATION_PORT}`);
  });
} catch (error) {
  console.error('Failed to start server', error);
  process.exit(1);
}
