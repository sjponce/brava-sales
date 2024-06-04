const mongoose = require('mongoose');

const status = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  if (req.query.enabled === true || req.query.enabled === false) {
    const updates = {
      enabled: req.query.enabled,
    };
    // Find the document by id and delete it
    const result = await User.findOneAndUpdate(
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
        message: 'No se encontro un documento',
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Se actualizo el documento',
      });
    }
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: "No se pudo cambiar el permiso del documento",
      })
      .end();
  }
};
module.exports = status;
