const { ROLE_ENUM } = require('@/middlewares/permission');
const mongoose = require('mongoose');

const update = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const Seller = mongoose.model('Seller');
  const reqUserName = userModel.toLowerCase();
  const { email, name, photo, surname, role, phone } = req.body;

  if (!email || !role || !name || !surname)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Faltan campos obligatorios',
    });

  if (role === ROLE_ENUM.OWNER && req[reqUserName].role !== ROLE_ENUM.OWNER) {
    return res.status(403).send({
      success: false,
      result: null,
      message: "No se puede modificar al owner",
    });
  }

  const tmpResult = await User.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if ( 
    role === ROLE_ENUM.OWNER &&
    req[reqUserName].role === ROLE_ENUM.OWNER &&
    tmpResult._id.toString() !== req[reqUserName]._id.toString()
  ) {
    return res.status(403).send({
      success: false,
      result: null,
      message: "No puedes modificar al owner",
    });
  }

  let userUpdates = {};
  let sellerUpdates = {};

  userUpdates = { email, role };
  sellerUpdates = { photo, name, surname, phone};

  // Find document by id and updates with the required fields
  const userResult = await User.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: userUpdates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!userResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontró el usuario',
    });
  }

  const sellerResult = await Seller.findOneAndUpdate(
    { user: req.params.id },
    { $set: sellerUpdates },
    {
      new: true,
    }
  ).exec();

  if (!sellerResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontró el vendedor',
    });
  }

  return res.status(200).json({
    success: true,
    result: {
      _id: userResult._id,
      enabled: userResult.enabled,
      email: userResult.email,
      name: sellerResult.name,
      surname: sellerResult.surname,
      photo: sellerResult.photo,
      role: sellerResult.role,
      phone: sellerResult.phone,
    },
    message: 'Se actualizó el vendedor',
  });
};

module.exports = update;
