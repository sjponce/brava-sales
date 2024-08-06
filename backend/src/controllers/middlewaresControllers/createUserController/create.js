const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');
const { ROLE_ENUM } = require('@/middlewares/permission');
const Seller = mongoose.model('Seller');
const Customer = mongoose.model('Customer');

const createRoleSpecificEntity = async (userData, resultUser) => {
  const entityData = { ...userData };
  delete entityData.password;

  let result;
  switch (userData.role) {
    case ROLE_ENUM.SELLER || ROLE_ENUM.ADMIN:
      result = await new Seller({
        user: resultUser._id,
        ...userData,
      }).save();
      break;
    case ROLE_ENUM.CUSTOMER:
      result = await new Customer({
        user: resultUser._id,
        ...userData,
      }).save();
      break;
  }

  if (!result) {
    return false;
  }
  return true;
};

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');

  const { email, password, enabled, role, name, surname } = req.body;
  if (!email || !password || !role || !name || !surname)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Faltan campos obligatorios',
    });

  if (req.body.role === ROLE_ENUM.OWNER) {
    return res.status(403).send({
      success: false,
      result: null,
      message: 'No puedes crear un usuario con el role de owner',
    });
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El email ya esta registrado.',
    });

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'La contraseña debe tener al menos 8 caracteres.',
    });

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  const resultUser = await new User({
    email,
    enabled,
    role,
  }).save();

  if (!resultUser) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'El usuario no pudo ser guardado',
    });
  }

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    user: resultUser._id,
    emailVerified: true,
  };

  const resultPassword = await new UserPassword(UserPasswordData).save();

  if (!resultPassword) {
    await User.deleteOne({ _id: resultUser._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: 'El password no pudo ser guardado',
    });
  }

  const entityCreated = await createRoleSpecificEntity(req.body, resultUser);
  if (!entityCreated) {
    await User.deleteOne({ _id: resultUser._id }).exec();
    await UserPassword.deleteOne({ user: resultUser._id }).exec();
    return res.status(403).json({
      success: false,
      result: null,
      message: `The ${req.body.role} could not be saved`,
    });
  }
  return res.status(200).send({
    success: true,
    result: { resultUser, entityCreated },
    message: 'Usuario y vendedor creado',
  });
};

module.exports = create;
