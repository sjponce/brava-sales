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
  test('test_listAll_successful_with_combined_data', async () => {
    const mockStockData = {
      stock123: [
        { id: 'var1', color: 'red', imageUrl: 'red.jpg' },
        { id: 'var2', color: 'blue', imageUrl: 'blue.jpg' },
      ],
    };
    const mockSalesData = [
      {
        _id: 'prod1',
        stockId: 'stock123',
        name: 'Product 1',
        toObject: () => ({ _id: 'prod1', stockId: 'stock123', name: 'Product 1' }),
      },
    ];
    const mockLatestPrice = 19.99;

    axiosInstance.get.mockResolvedValue({ data: mockStockData });
    getSalesProducts.mockResolvedValue(mockSalesData);
    getLatestPrice.mockResolvedValue(mockLatestPrice);

    await listAll(req, res, axiosInstance);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: [
        {
          _id: 'prod1',
          stockId: 'stock123',
          name: 'Product 1',
          price: 19.99,
          variations: [
            { id: 'var1', color: 'red', imageUrl: 'red.jpg' },
            { id: 'var2', color: 'blue', imageUrl: 'blue.jpg' },
          ],
        },
      ],
      message: 'Se encontraron los productos',
    });
  });

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
