const modelExceptions = require('./modelExceptions');

const create = async (Model, req, res) => {
  // Creating a new document in the collection
  req.body.removed = false;

  // Checking if there are any exceptions for creation
  const createExceptionFunctions = Object.values(modelExceptions[Model.modelName]?.create || {});

  for (const exceptionFunction of createExceptionFunctions) {
    const exceptionResult = await exceptionFunction(Model, req);
    if (exceptionResult) {
      return res.status(400).json(exceptionResult);
    }
  }

  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Se creo un nuevo documento',
  });
};

module.exports = create;
