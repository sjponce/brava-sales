const mongoose = require('mongoose');
const listAllStockReservations = require('./listAllStockReservations');

jest.mock('mongoose', () => ({
  model: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }),
}));

describe('listAllStockReservations', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_successful_retrieval_of_stock_reservations', async () => {
    const mockReservations = [
      { _id: 'reservation1', salesOrder: 'order1' },
      { _id: 'reservation2', salesOrder: 'order2' },
    ];
    mongoose.model().find().populate().exec.mockResolvedValue(mockReservations);

    await listAllStockReservations(req, res);

    expect(mongoose.model().find).toHaveBeenCalled();
    expect(mongoose.model().populate).toHaveBeenCalledWith('salesOrder');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: mockReservations,
      message: 'Reservas de stock obtenidas exitosamente',
    });
  });

  test('test_empty_stock_reservations', async () => {
    mongoose.model().find().populate().exec.mockResolvedValue([]);

    await listAllStockReservations(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: [],
      message: 'Reservas de stock obtenidas exitosamente',
    });
  });

  test('test_internal_server_error', async () => {
    const errorMessage = 'Database connection failed';
    mongoose.model().find().populate().exec.mockRejectedValue(new Error(errorMessage));

    await listAllStockReservations(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Error interno del servidor',
      error: errorMessage,
    });
  });
});
