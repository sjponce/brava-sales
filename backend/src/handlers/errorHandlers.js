/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return (req, res, next) =>
    fn(req, res, next).catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'faltan campos requeridos',
          controller: fn.name,
          error: error,
        });
      } else {
        // Server Error
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          controller: fn.name,
          error: error,
        });
      }
    });
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "La ruta no existe ",
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (error, req, res) => {
  error.stack = error.stack || '';

  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
exports.productionErrors = (error, req, res) => {
  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};
