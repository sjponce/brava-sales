const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
  const settingKey = req.params.settingKey || undefined;

  if (!settingKey) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No hay una key de configuración',
    });
  }
  const { settingValue } = req.body;

  if (!settingValue) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No hay un valor de configuración',
    });
  }
  const result = await Model.findOneAndUpdate(
    { settingKey },
    {
      settingValue,
    },
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No hay un documento: ' + settingKey,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Actualizamos este documento: ' + settingKey,
    });
  }
};

module.exports = updateBySettingKey;
