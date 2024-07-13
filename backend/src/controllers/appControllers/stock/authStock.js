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

module.exports = { authStock };
