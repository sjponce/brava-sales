const { callWithAuth } = require('./callWithAuth');
const { authStock } = require('./authStock');
const axios = require('axios');
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

jest.mock('./authStock');
jest.mock('axios');

describe('callWithAuth', () => {
  let req, res, method;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    method = jest.fn();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('test_auth_stock_failure', async () => {
    authStock.mockResolvedValue(null);

    await callWithAuth(req, res, method);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Hubo un error en la autenticacion con stock',
    });
  });

  test('test_method_called_with_correct_params', async () => {
    const stockToken = 'valid-token';
    authStock.mockResolvedValue(stockToken);
    const axiosInstance = axios.create({ headers: { 'X-Auth-Token': stockToken } });

    await callWithAuth(req, res, method, 'arg1', 'arg2');

    expect(method).toHaveBeenCalledWith(req, res, axiosInstance, 'arg1', 'arg2');
  });

  test('test_method_execution_error', async () => {
    const stockToken = 'valid-token';
    authStock.mockResolvedValue(stockToken);
    const error = new Error('Method execution error');
    method.mockImplementation(() => { throw error; });

    await callWithAuth(req, res, method);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Error interno de stock',
      error: error.message,
    });
  });
});