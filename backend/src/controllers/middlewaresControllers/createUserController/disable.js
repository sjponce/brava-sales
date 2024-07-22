const mongoose = require('mongoose');

const disable = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const user = await User.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  if (user.role === 'owner') {
    return res.status(403).json({
      success: false,
      message: "No se puede deshabilitar el usuario owner",
    });
  }

  const updates = { enabled: !user.enabled };

  const result = await User.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },
    {
      new: true,
    }
  ).exec();
  
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: "No se pudo actualizar el estado del usuario",
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: `Se ${result.enabled ? 'habilito' : 'deshabilito'} el usuario`,
    });
  }
};

module.exports = disable;
