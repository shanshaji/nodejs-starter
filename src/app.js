const express = require('express');

const loaders = require('./loaders');

const logger = require('./loaders/logger');

const startServer = async () => {
  const app = express();
  const port = process.env.PORT;
  // initialize loaders
  await loaders({ expressApp: app });

  app
    .listen(port, () => {
      logger.info(`Server listening at http://localhost:${port}`);
    })
    .on('error', (err) => {
      logger.error(err.message);

      process.exit(1);
    });
};

startServer();
