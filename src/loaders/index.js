const expressLoader = require('./express');
const logger = require('./logger');
const mongooseLoader = require('./mongoose.js');
require("./events");

module.exports = async ({ expressApp }) => {
  logger.info('initializing loaders!');

  await mongooseLoader();
  logger.info('connected to db!');

  expressLoader(expressApp);
};
