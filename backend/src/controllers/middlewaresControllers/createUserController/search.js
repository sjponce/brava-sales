const mongoose = require('mongoose');

const search = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name', 'surname', 'email'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }
  const result = await User.find({
    ...fields,
  })
    .where('removed', false)
    .sort({ enabled: -1 })
    .limit(20)
    .exec();

  if (result.length >= 1) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontraron todos los elementos',
    });
  } else {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No se encontraron elementos',
    });
  }
};
module.exports = search;
