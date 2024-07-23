const update = require('./update');
const axios = require('axios');
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
jest.mock('axios');

describe('update', () => {
  let req, res, axiosInstance;

  beforeEach(() => {
    req = { params: { id: '1' }, body: { name: 'Updated Product' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    axiosInstance = axios;
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('test_update_successful_api_call', async () => {
    const mockData = { data: 'updated product data' };
    axiosInstance.put.mockResolvedValue({ data: mockData });

    await update(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: mockData,
      message: 'Se actualizo el producto',
    });
  });

  test('test_update_product_not_found', async () => {
    axiosInstance.put.mockRejectedValue({ response: { status: 404 } });

    await update(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontro el producto',
    });
  });

  test('test_update_unexpected_error', async () => {
    const errorMessage = 'Network Error';
    axiosInstance.put.mockRejectedValue(new Error(errorMessage));

    await update(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Ocurrio un error contactando a Stock',
      error: errorMessage,
    });
  });
});