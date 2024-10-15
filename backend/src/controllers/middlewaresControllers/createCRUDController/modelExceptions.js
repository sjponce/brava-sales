const sellerException = require('./exceptions/sellerException');
// Import exceptions for other models here

const modelExceptions = {
  User: sellerException,
  Customer: sellerException
};

module.exports = modelExceptions;