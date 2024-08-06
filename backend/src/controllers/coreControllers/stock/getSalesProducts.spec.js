const mongoose = require('mongoose');
const getSalesProducts = require('./getSalesProducts');

// Mock the mongoose model
jest.mock('mongoose', () => ({
  model: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }),
}));

describe('getSalesProducts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return products when successful', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', tags: [] },
      { id: '2', name: 'Product 2', tags: [] },
    ];
    mongoose.model().exec.mockResolvedValue(mockProducts);

    const result = await getSalesProducts();

    expect(result).toEqual(mockProducts);
    expect(mongoose.model).toHaveBeenCalledWith('Product');
    expect(mongoose.model().find).toHaveBeenCalled();
    expect(mongoose.model().populate).toHaveBeenCalledWith('tags');
    expect(mongoose.model().exec).toHaveBeenCalled();
  });

  test('should return an empty array when an error occurs', async () => {
    mongoose.model().exec.mockRejectedValue(new Error('Database error'));

    const result = await getSalesProducts();

    expect(result).toEqual([]);
    expect(mongoose.model).toHaveBeenCalledWith('Product');
    expect(mongoose.model().find).toHaveBeenCalled();
    expect(mongoose.model().populate).toHaveBeenCalledWith('tags');
    expect(mongoose.model().exec).toHaveBeenCalled();
  });
});