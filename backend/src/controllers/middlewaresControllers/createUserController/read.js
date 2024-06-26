const mongoose = require('mongoose');

const read = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  // Find document by id
  const tmpResult = await User.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();
  // If no results found, return document not found
  if (!tmpResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontro un documento',
    });
  } else {
    // Return success resposne
    const result = {
      _id: tmpResult._id,
      enabled: tmpResult.enabled,
      email: tmpResult.email,
      name: tmpResult.name,
      surname: tmpResult.surname,
      photo: tmpResult.photo,
      role: tmpResult.role,
    };

    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontro el documento',
    });
  }
};

module.exports = read;
