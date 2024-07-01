const axios = require('axios');
const jwt = require('jsonwebtoken');

let stockToken = null;
let tokenExpiration = null;

const authStock = async () => {
  try {
    // Check if the token exists and is not expired
    if (stockToken && tokenExpiration && tokenExpiration > Date.now()) {
      return stockToken;
    }

    // If the token is expired or doesn't exist, fetch a new one
    const response = await axios.post(`${process.env.STOCK_API}/user/login`, {
      userName: process.env.STOCK_USERNAME,
      password: process.env.STOCK_SECRET,
    });

    stockToken = response.data.Token;

    // Decode the token to get the expiration time
    const decodedToken = jwt.decode(stockToken);
    tokenExpiration = decodedToken.exp * 1000; // Convert from seconds to milliseconds

    return stockToken;
  } catch (error) {
    console.error('Error authenticating with stock API:', error);
    throw new Error('Ocurrio un error contactando a Stock');
  }
};

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

module.exports = { callWithAuth, authStock };
