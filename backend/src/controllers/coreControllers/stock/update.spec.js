// Mock getLatestPrice before requiring update
jest.mock('./getLatestPrice', () => jest.fn());

// Mock mongoose models before requiring the module under test
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockPriceHistoryInstance = {
  save: jest.fn(),
};

jest.mock('mongoose', () => ({
  model: jest.fn().mockImplementation((name) => {
    if (name === 'Product') {
      return {
        findById: mockFindById,
        findByIdAndUpdate: mockFindByIdAndUpdate,
      };
    }
    if (name === 'PriceHistory') {
      return jest.fn().mockImplementation(() => mockPriceHistoryInstance);
    }
    return function () {};
  }),
}));

const update = require('./update');
const getLatestPrice = require('./getLatestPrice');

describe('update', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: '66dfb64217a7575df381d432' },
      body: {
        description: 'Zapatillas actualizadas',
        tags: [{ _id: '669e8a6d12a981605504c8e4', name: 'zapatillas' }],
        price: 25500,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('test_update_successful', async () => {
    const existingProduct = { _id: '66dfb64217a7575df381d432', description: 'Old description' };
    const updatedProduct = { ...existingProduct, ...req.body };

    mockFindById.mockResolvedValue(existingProduct);
    getLatestPrice.mockResolvedValue(25000);
    mockPriceHistoryInstance.save.mockResolvedValue({});
    mockFindByIdAndUpdate.mockResolvedValue(updatedProduct);

    await update(req, res);

    expect(mockFindById).toHaveBeenCalledWith('66dfb64217a7575df381d432');
    expect(getLatestPrice).toHaveBeenCalledWith('66dfb64217a7575df381d432');
    expect(mockPriceHistoryInstance.save).toHaveBeenCalled();
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      '66dfb64217a7575df381d432',
      {
        description: 'Zapatillas actualizadas',
        tags: [{ _id: '669e8a6d12a981605504c8e4', name: 'zapatillas' }],
      },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: updatedProduct,
      message: 'Producto actualizado exitosamente',
    });
  });

  test('test_update_missing_required_fields', async () => {
    req.body = { description: 'Solo descripción' };

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Faltan campos requeridos: description o tags',
    });
    expect(mockFindById).not.toHaveBeenCalled();
  });

  test('test_update_product_not_found', async () => {
    mockFindById.mockResolvedValue(null);

    await update(req, res);

    expect(mockFindById).toHaveBeenCalledWith('66dfb64217a7575df381d432');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Producto no encontrado',
    });
  });

  test('test_update_without_price_change', async () => {
    const existingProduct = { _id: '66dfb64217a7575df381d432' };
    req.body = {
      description: 'Descripción nueva',
      tags: [{ _id: '669e8a6d12a981605504c8e4', name: 'zapatillas' }],
      price: 25000,
    };

    mockFindById.mockResolvedValue(existingProduct);
    getLatestPrice.mockResolvedValue(25000);
    mockFindByIdAndUpdate.mockResolvedValue({ ...existingProduct, ...req.body });

    await update(req, res);

    expect(mockPriceHistoryInstance.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('test_update_unexpected_error', async () => {
    const errorMessage = 'Database connection error';
    mockFindById.mockRejectedValue(new Error(errorMessage));

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Error al actualizar el producto',
      error: errorMessage,
    });
  });
});