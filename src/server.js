const app = require('./app');
const { config } = require('./config');

app.listen(config.APPLICATION_PORT, () => {
  console.log(`Server is listening on port: ${config.APPLICATION_PORT}`);
});
