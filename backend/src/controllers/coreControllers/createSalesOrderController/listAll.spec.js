const mongoose = require('mongoose');
const listAll = require('./listAll');
const SalesOrder = mongoose.model('SalesOrder');
const Installment = mongoose.model('Installment');

jest.mock('mongoose', () => {
  const mQuery = {
    exec: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
  };
  const mModel = {
    findOne: jest.fn().mockReturnValue(mQuery),
    find: jest.fn().mockReturnValue(mQuery),
  };
  return {
    model: jest.fn().mockReturnValue(mModel),
  };
});

describe('listAll', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_listAll_with_valid_id', async () => {
    const mockSalesOrders = [
      { _id: '1', name: 'Order 1' },
      { _id: '2', name: 'Order 2' }
    ];
    SalesOrder.find().exec.mockResolvedValue(mockSalesOrders);
  
    await listAll(req, res);
  
    expect(SalesOrder.find).toHaveBeenCalledWith({ removed: false });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: mockSalesOrders,
      message: 'Se encontraron las ordenes de venta',
    });
  });


  test('test_listAll_unexpected_error', async () => {
    const errorMessage = 'Unexpected Error';
    SalesOrder.findOne().exec.mockRejectedValue(new Error(errorMessage));

    await listAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Ocurrio un error buscando las ordenedes de venta',
      error: errorMessage,
    });
  });

  test('test_listAll_with_valid_id_and_installments', async () => {
    const mockSalesOrderId = '123456789';
    const mockSalesOrder = { _id: mockSalesOrderId, name: 'Order 1' };
    const mockInstallments = [
      { _id: 'inst1', salesOrder: mockSalesOrderId },
      { _id: 'inst2', salesOrder: mockSalesOrderId }
    ];
  
    SalesOrder.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({...mockSalesOrder, toObject: jest.fn().mockReturnValue({ _id: mockSalesOrderId, name: 'Order 1' })})
    });
  
    Installment.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockInstallments)
    });
  
    req.params = { id: mockSalesOrderId };
  
    await listAll(req, res);
  
    expect(SalesOrder.findOne).toHaveBeenCalledWith({ removed: false, _id: mockSalesOrderId });
    expect(Installment.find).toHaveBeenCalledWith({ salesOrder: mockSalesOrderId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: { ...mockSalesOrder, installments: mockInstallments },
      message: 'Se encontraron las ordenes de venta',
    });
  });
});