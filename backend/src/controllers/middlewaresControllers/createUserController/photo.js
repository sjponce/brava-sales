const mongoose = require('mongoose');

const photo = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const updates = {
    photo: req.body.photo,
  };

  const tmpResult = await User.findOneAndUpdate(
    { _id: req.user._id, removed: false },

    { $set: updates },
    { new: true, runValidators: true }
  );

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
      message: 'Actualización exitosa',
    });
  }
};
module.exports = photo;
