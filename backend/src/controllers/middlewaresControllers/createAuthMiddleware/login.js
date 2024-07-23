const Joi = require('joi');

const mongoose = require('mongoose');
const authUser = require('./authUser');
const { ROLE_ENUM } = require('../../../middlewares/permission');

const login = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Credenciales inválidas.',
      errorMessage: error.message,
    });
  }

  const user = await UserModel.findOne({ email, removed: false });

  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No hay una cuenta con este mail creada.',
    });

  const databasePassword = await UserPasswordModel.findOne({
    user: user._id,
    removed: false,
  });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'El usuario no esta habilitado.',
    });

  if (user.role === ROLE_ENUM.CUSTOMER)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'El usuario no es un vendedor.',
    });
    
  const seller = await mongoose.model('Seller').findOne({ user: user._id });

  if (!seller)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No existe un vendedor con este usuario',
    });

  //  authUser if your has correct password
  authUser(req, res, { user, databasePassword, password, UserPasswordModel, seller });
};

module.exports = login;
 