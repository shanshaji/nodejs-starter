module.exports = (err, req, res, next) => {
    try {
       console.log('congrats you hit the error middleware');
       if(err.name === 'ValidationError') return err = handleValidationError(err, res);
       if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    } catch(err) {
      res.status(500).send('An unknown error occurred.');
    }
}
// app.use((err, req, res, next) => {
//     if (err['status'] === '401') {
//       return res.status(err.status).send({ message: err.message }).end();
//     }
//     return next(err);
//   });
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.json({
//       errors: {
//         message: err.message,
//       },
//     });
//   });

//   /// catch 404 and forward to error handler
//   app.use((req, res, next) => {
//     const err = new Error('Not Found');
//     err['status'] = 404;
//     next(err);
//   });
