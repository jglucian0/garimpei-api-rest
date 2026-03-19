require('dotenv').config();

const requiredEnvs = ['DATABASE_URL', 'APP_URL'];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.error(`[Config] FATAL ERROR: Environment variable ${env} not defined!`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  appUrl: process.env.APP_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};
