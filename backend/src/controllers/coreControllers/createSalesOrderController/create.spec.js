const mongoose = require('mongoose');
const create = require('./create');
const { getLatestPrice } = require('./create');

jest.mock('mongoose', () => {
  const mSalesOrder = function () {
    this.save = jest
      .fn()
      .mockResolvedValue({
        message: 'La Orden de venta se creo correctamente',
        result: { salesOrder: { result: { salesOrder: { totalAmount: 800 } }, success: true } },
        success: true,
      });
  };
  const mInstallment = function () {
    this.save = jest.fn().mockResolvedValue({});
  };
  const mPriceHistory = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ price: 100 }),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    }),
  };
  return {
    model: jest.fn().mockImplementation((modelName) => {
      if (modelName === 'SalesOrder') {
        return mSalesOrder;
      }
      if (modelName === 'Installment') {
        return mInstallment;
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
          { productId: 'product1', quantity: 2 },
          { productId: 'product2', quantity: 3 },
        ],
        installmentsCount: 2,
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
      { productId: 'product1', quantity: 0 },
      { productId: 'product2', quantity: 0 },
    ];

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontraron productos para la orden de venta',
    });
  });
});
