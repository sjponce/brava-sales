const { ROLE_ENUM } = require('@/middlewares/permission');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const remove = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  // Find the document by id and delete it
  const user = await User.findOne({
    _id: req.params.id,

    removed: false,
  }).exec();

  if (user.role === ROLE_ENUM.OWNER) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "No se puede eliminar el usuario owner",
    });
  }

  const updates = {
    removed: true,
    email: 'removed+' + uniqueId() + '+' + user.email,
  };
  // Find the document by id and delete it
  const result = await User.findOneAndUpdate(
    { _id: req.params.id },
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
      message: 'No se encontró un documento',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Se elimino el documento',
    });
  }
};

module.exports = remove;
