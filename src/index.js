// const initLoaders = require('./app')
// const logger = require("./loaders/logger");
// const port = process.env.PORT;
// (async () => {
//     const app = await initLoaders()
//     app.listen(port, () => {
//         logger.info(`Server listening at http://localhost:${port}`);
//       })
//       .on("error", (err) => {
//         logger.error(err.message);

//         process.exit(1);
//       });
// })()

// app
//   .listen(port, () => {
//     logger.info(`Server listening at http://localhost:${port}`);
//   })
//   .on("error", (err) => {
//     logger.error(err.message);

//     process.exit(1);
//   });

const { startServer } = require("./app");
startServer();