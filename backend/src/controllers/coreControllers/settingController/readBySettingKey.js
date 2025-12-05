const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const readBySettingKey = async (req, res) => {
  // Find document by id
  const settingKey = req.params.settingKey || undefined;

  if (!settingKey) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Por favor indique los parametros a buscar',
    });
  }

  const result = await Model.findOne({
    settingKey,
  });

  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontró un documento: ' + settingKey,
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontró el documento: ' + settingKey,
    });
  }
};

module.exports = readBySettingKey;
