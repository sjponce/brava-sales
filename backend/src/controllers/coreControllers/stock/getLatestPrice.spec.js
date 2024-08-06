const mongoose = require('mongoose');
const getLatestPrice = require('./getLatestPrice');

// Mock the mongoose model
jest.mock('mongoose', () => ({
  model: jest.fn().mockReturnValue({
    findOne: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }),
}));

describe('getLatestPrice', () => {
  const mockProductId = 'mockProductId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the latest price when a price history exists', async () => {
    const mockLatestPrice = { price: 99.99 };
    mongoose.model().findOne().sort().exec.mockResolvedValue(mockLatestPrice);

    const result = await getLatestPrice(mockProductId);
    expect(result).toBe(99.99);
  });

  test('should return 0 when no price history exists', async () => {
    mongoose.model().findOne().sort().exec.mockResolvedValue(null);

    const result = await getLatestPrice(mockProductId);
    expect(result).toBe(0);
  });

  test('should return 0 and log error when an exception occurs', async () => {
    const mockError = new Error('Database error');
    mongoose.model().findOne().sort().exec.mockRejectedValue(mockError);

    console.error = jest.fn();

    const result = await getLatestPrice(mockProductId);
    expect(result).toBe(0);
    expect(console.error).toHaveBeenCalledWith(
      `Error fetching price for product ${mockProductId}:`,
      mockError
    );
  });

  test('should call mongoose methods with correct parameters', async () => {
    await getLatestPrice(mockProductId);

    expect(mongoose.model).toHaveBeenCalledWith('PriceHistory');
    expect(mongoose.model().findOne).toHaveBeenCalledWith({ product: mockProductId });
    expect(mongoose.model().findOne().sort).toHaveBeenCalledWith({ effectiveDate: -1 });
  });
});
