const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');
const { ROLE_ENUM } = require('@/middlewares/permission');
const { default: axios } = require('axios');
const translate = require('@/utils/translateModel');

const createRoleSpecificEntity = async (userData, resultUser, token) => {
  const entityData = { ...userData };
  delete entityData.password;

  if(![ROLE_ENUM.ADMIN, ROLE_ENUM.CUSTOMER, ROLE_ENUM.SELLER].includes(userData.role)) {
    return false;
  }

  let result;
  const cookie = `token=${token}`;
      result = await axios.post(
        `${process.env.BASE_API}/${userData.role}/create`,
        {
          ...userData,
          user: resultUser._id,
        },
        {
          headers: {
            cookie,
          },
        }
      );

  if (!result) {
    return false;
  }
  return true;
};

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');

  const { email, password, enabled, role, name } = req.body;
  if (!email || !password || !role || !name)
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
    forcePasswordReset: role === ROLE_ENUM.CUSTOMER,
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

  const entityCreated = await createRoleSpecificEntity(req.body, resultUser, req.cookies.token);
  if (!entityCreated) {
    await User.deleteOne({ _id: resultUser._id }).exec();
    await UserPassword.deleteOne({ user: resultUser._id }).exec();
    return res.status(403).json({
      success: false,
      result: null,
      message: `El ${translate(req.body.role)} no pudo ser creado`,
    });
  }
  return res.status(200).send({
    success: true,
    result: { resultUser, entityCreated },
    message: `Usuario y ${translate(req.body.role)} creado`,
  });
};

module.exports = create;
