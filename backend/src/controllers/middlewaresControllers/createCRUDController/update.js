const modelExceptions = require("./modelExceptions");
const translate = require('../../../utils/translateModel');

const update = async (Model, req, res) => {
  // Checking if there are any exceptions for creation
  const createExceptionFunctions = Object.values(modelExceptions[Model.modelName]?.update || {});

  for (const exceptionFunction of createExceptionFunctions) {
    const exceptionResult = await exceptionFunction(Model, req);
    if (exceptionResult) {
      return res.status(400).json(exceptionResult);
    }
  }

  // Find document by id and updates with the required fields
  req.body.removed = false;
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true, // return the new result instead of the old one
    runValidators: true,
  }).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: `No se encontro el ${translate(Model.modelName)}`,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: `Se actualizo el ${translate(Model.modelName)}`,
    });
  }
};

module.exports = update;
