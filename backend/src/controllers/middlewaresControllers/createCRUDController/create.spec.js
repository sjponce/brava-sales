const create = require('./create');
const modelExceptions = require('./modelExceptions');
const translate = require('../../../utils/translateModel');
const mongoose = require('mongoose');

describe('create', () => {
  let req, res, Model;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    delete mongoose.models.TestModel; // Clear the existing model definition
    Model = mongoose.model('TestModel', new mongoose.Schema({ name: String }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 400 status code with the appropriate exception message when an exception function returns a result', async () => {
    modelExceptions.TestModel = {
      create: {
        exceptionFunction: jest.fn().mockResolvedValue({ error: 'Exception occurred' }),
      },
    };

    await create(Model, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Exception occurred' });
  });

  it('should return a 200 status code and the created document when the creation is successful without any exceptions', async () => {
    modelExceptions.TestModel = {
      create: {},
    };

    const savedDoc = { _id: '123', name: 'Test' };
    jest.spyOn(Model.prototype, 'save').mockResolvedValue(savedDoc);

    await create(Model, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: savedDoc,
      message: `El ${translate(Model.modelName)} se creo correctamente`,
    });
  });

  it('should set the `removed` field to `false` in the request body before creating the document', async () => {
    modelExceptions.TestModel = {
      create: {},
    };

    const savedDoc = { _id: '123', name: 'Test' };
    jest.spyOn(Model.prototype, 'save').mockResolvedValue(savedDoc);

    await create(Model, req, res);

    expect(req.body.removed).toBe(false);
  });
});