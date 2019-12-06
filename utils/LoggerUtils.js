const log4js = require('log4js');
const logConfiguration = require('../config/log4j/logger-config.json');

log4js.configure(logConfiguration);

const consoleLogger = log4js.getLogger('consoleout');
const eventAlert = log4js.getLogger('eventAlert');

module.exports = {
  consoleLogger,
  eventAlert,
};
