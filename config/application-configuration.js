const currentEnv = process.env.NODE_ENV || 'dev';
const { consoleLogger } = require('../utils/LoggerUtils');

// set the common configuration
const applicationConfig = {
  env: currentEnv,
};

// load the bootstrap env
const bootstrapConfiguration = require('./bootstrap.json');

// load the addition env
const additionConfiguration = require(`./${currentEnv}.json`);

const targetConfiguration = Object.assign(
  applicationConfig,
  additionConfiguration,
);

if (currentEnv === 'dev') {
  consoleLogger.info(targetConfiguration);
}

module.exports = Object.assign(targetConfiguration, bootstrapConfiguration);
