const translate = require('../../../utils/translateModel');

const remove = async (Model, req, res) => {
  // Find the document by id and delete it
  const updates = {
    removed: true,
  };
  // Find the document by id and delete it
  const result = await Model.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();
  // If no results found, return document not found
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
      message: `Se elimino el ${translate(Model.modelName)}`,
    });
  }
};

module.exports = remove;
