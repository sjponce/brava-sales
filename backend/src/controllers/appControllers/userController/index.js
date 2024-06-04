const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const listAll = require('./listAll');

function modelController() {
  const Model = mongoose.model('User');
  const methods = createCRUDController('User');

  methods.listAll = (req, res) => listAll(Model, req, res);
  return methods;
}

module.exports = modelController();
