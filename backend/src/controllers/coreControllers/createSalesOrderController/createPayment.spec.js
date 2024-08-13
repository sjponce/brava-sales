const mongoose = require('mongoose');
const createPayment = require('./createPayment');

jest.mock('mongoose', () => {
  const mInstallment = {
    findById: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
  };
  return {
    Schema: jest.fn(),
    model: jest.fn().mockImplementation((modelName) => {
      if (modelName === 'Installment') return mInstallment;
      if (modelName === 'Payment') return paymentModel;
    }),
  };
});
const paymentModel = function () {
    return {
        save: jest.fn().mockResolvedValue({ _id: 'payment123', amount: 100 }),
      };
  };
  paymentModel.findOne = jest.fn().mockReturnValue({
    exec: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  });

describe('createPayment', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        installmentId: 'installment123',
        paymentData: {
          amount: 100,
          paymentMethod: 'credit_card',
          photo: 'payment.jpg',
        },
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

  test('test_create_payment_success', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [],
      save: jest.fn().mockResolvedValue(true),
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      installment: expect.objectContaining({
        _id: 'installment123',
        payments: expect.arrayContaining([expect.objectContaining({ _id: 'payment123' })]),
      }),
      message: 'Se encontraron las ordenes de venta',
    });
  });

  test('test_create_payment_installment_not_found', async () => {
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(null);

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Ocurrio un error buscando las ordenedes de venta',
      error: 'Installment not found',
    });
  });

  test('test_create_payment_amount_exceeds_installment', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [{ amount: 150, removed: false, disabled: false }],
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El monto es mayor al monto de la cuota',
      error: 'El monto es mayor al monto de la cuota',
    });
  });

  test('test_create_payment_marks_installment_as_paid', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 300,
      payments: [{ amount: 100, removed: false, disabled: false }],
      save: jest.fn().mockResolvedValue(true),
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    await createPayment(req, res);

    expect(mockInstallment.status).toBe('Paid');
    expect(mockInstallment.totalPaymentDate).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
