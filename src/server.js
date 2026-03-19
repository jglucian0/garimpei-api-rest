require('dotenv').config();

const sessionSingleton = require('./services/sessionSingleton');
sessionSingleton.initBrowser();

const gracefulShutdown = async () => {
  await sessionSingleton.closeBrowser();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Server] 'garimepi-api-rest' running in ${PORT}`);
});
