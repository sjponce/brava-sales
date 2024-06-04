const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  // req/body = [{settingKey:"",settingValue}]
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings } = req.body;

  for (const setting of settings) {
    if (
      !Object.prototype.hasOwnProperty.call(setting, 'settingKey') ||
      !Object.prototype.hasOwnProperty.call(setting, 'settingValue')
    ) {
      settingsHasError = true;
      break;
    }

    const { settingKey, settingValue } = setting;

    updateDataArray.push({
      updateOne: {
        filter: { settingKey: settingKey },
        update: { settingValue: settingValue },
      },
    });
  }

  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No hay settings para actualizar',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Hubo un error al actualizar los settings',
    });
  }
  const result = await Model.bulkWrite(updateDataArray);

  if (!result || result.nMatched < 1) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontraron settings',
    });
  } else {
    return res.status(200).json({
      success: true,
      result: [],
      message: 'Actualizamos todos los settings',
    });
  }
};

module.exports = updateManySetting;
