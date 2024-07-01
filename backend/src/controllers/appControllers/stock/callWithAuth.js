const axios = require('axios');
const { authStock } = require('./authStock');
const callWithAuth = async (req, res, method, ...args) => {
  try {
    const stockToken = await authStock(req, res);
    if (!stockToken) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Hubo un error en la autenticacion con stock',
      });
    }
    // Create an instance of Axios with the token injected in the headers
    const axiosInstance = axios.create({
      headers: {
        'X-Auth-Token': stockToken,
      },
    });

    return method(req, res, axiosInstance, ...args);
  } catch (error) {
    console.error(`Error in stock method ${method.name}:`, error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error interno de stock',
      error: error.message,
    });
  }
};

module.exports = { callWithAuth };
