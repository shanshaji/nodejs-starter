const expressLoader = require("./express");
const logger = require("./logger");

const mongooseLoader = require("./mongoose.js");

module.exports = async ({ expressApp }) => {
  logger.info("initializing loaders!");

  const mongoConnection = await mongooseLoader();
  logger.info("connected to db!");

  expressLoader(expressApp);
};
