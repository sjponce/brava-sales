const listAll = require('./listAll');
const axios = require('axios');
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
const getSalesProducts = require('./getSalesProducts');
const getLatestPrice = require('./getLatestPrice');
jest.mock('axios');
jest.mock('./getSalesProducts');
jest.mock('./getLatestPrice');
describe('listAll', () => {
  let req, res, axiosInstance;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    axiosInstance = axios;
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });
  test('pass', ()=> {
    expect(true).toBe(true);
  })

  test('test_listAll_product_not_found', async () => {
    axiosInstance.get.mockRejectedValue({ response: { status: 404 } });

    await listAll(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontraron productos',
    });
  });

  test('test_listAll_sales_not_found', async () => {
    axiosInstance.get.mockResolvedValue({ data: { products: [] } });
    getSalesProducts.mockResolvedValue([]);

    await listAll(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontraron productos en ventas',
    });
  });

  test('test_listAll_unexpected_error', async () => {
    const errorMessage = 'Network Error';
    axiosInstance.get.mockRejectedValue(new Error(errorMessage));

    await listAll(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Ocurrio un error contactando a Stock',
      error: errorMessage,
    });
  });
});
