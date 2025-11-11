const mongoose = require('mongoose');

const create = require('./create');
const { getLatestPrice } = require('./create');

// Mock NotificationHelpers
jest.mock('../../../helpers/NotificationHelpers', () => ({
  onOrderCreated: jest.fn().mockResolvedValue(true),
}));

jest.mock('mongoose', () => {
  const mSaveOrder = jest.fn().mockResolvedValue({
    _id: 'order123',
    salesOrderCode: 'OV-001',
    customer: 'customer1',
    totalAmount: 800,
    finalAmount: 500,
    orderDate: new Date(),
  });
  const mSaveInstallment = function () {
    this.save = jest.fn().mockResolvedValue({});
  };
  const mPriceHistory = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ price: 100 }),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    }),
  };

  const SalesOrderModel = function () {
    return { save: mSaveOrder };
  };

  SalesOrderModel.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue({ salesOrderCode: 'OV-000' }),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  });

  SalesOrderModel.findById = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'order123',
        customer: { name: 'Test Customer' },
        salesOrderCode: 'OV-001',
      }),
    }),
  });

  const InstallmentModel = function () {
    return { save: mSaveInstallment };
  };

  return {
    model: jest.fn().mockImplementation((modelName) => {
      if (modelName === 'SalesOrder') {
        return SalesOrderModel;
      }
      if (modelName === 'Installment') {
        return InstallmentModel;
      }
      if (modelName === 'PriceHistory') {
        return mPriceHistory;
      }
      return {
        findOne: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
          sort: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
        }),
        save: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

describe('create', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        customer: 'customer1',
        orderDate: new Date(),
        shippingAddress: '123 Street',
        products: [
          { product: 'product1', sizes: [{ quantity: 2 }] },
          { product: 'product2', sizes: [{ quantity: 3 }] },
        ],
        installmentsCount: 2,
        discount: 0,
        finalAmount: 840, // totalAmount: 800, con interés (2 cuotas): 800 + (800 * 0.05 * 1) = 840
        responsible: 'user123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_calculate_total_amount', async () => {
    mongoose.model('PriceHistory').findOne().exec.mockResolvedValueOnce({ price: 100 });
    mongoose.model('PriceHistory').findOne().exec.mockResolvedValueOnce({ price: 200 });

    await create(req, res);

    expect(mongoose.model('PriceHistory').findOne).toHaveBeenCalledWith({ product: 'product1' });
    expect(mongoose.model('PriceHistory').findOne).toHaveBeenCalledWith({ product: 'product2' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('test_create_sales_order_without_products', async () => {
    req.body.products = [];

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontraron productos para la orden de venta',
    });
  });

  test('test_create_sales_order_with_empty_amounts', async () => {
    req.body.products = [
      { product: 'product1', sizes: [{ quantity: 0 }] },
      { product: 'product2', sizes: [{ quantity: 0 }] },
    ];

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontraron productos para la orden de venta',
    });
  });

  test('test_final_amount_mismatch', async () => {
    req.body.finalAmount = 1000; // Set a mismatched final amount
    req.body.discount = 0; // Set discount to 0 for simplicity
  
    await create(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El monto final calculado no coincide con el monto enviado',
    });
  });
});