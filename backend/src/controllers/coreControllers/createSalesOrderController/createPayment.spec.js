const mongoose = require('mongoose');
const createPayment = require('./createPayment');
const { getPreference } = require('@/config/mercadoPagoConfig');

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

jest.mock('@/config/mercadoPagoConfig', () => ({
  getPreference: jest.fn(),
}));

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
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
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
      message: 'Se creo el pago',
    });
  });

  test('test_create_payment_installment_not_found', async () => {
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(null);

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontro la cuota',
    });
  });

  test('test_create_payment_amount_exceeds_installment', async () => {    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [{ amount: 150, removed: false, disabled: false, status: 'Approved' }],
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El monto es mayor al monto de la cuota',
    });
  });
  test('test_create_payment_marks_installment_as_paid', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [{ amount: 100, removed: false, disabled: false, status: 'Approved' }],
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    };    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);    await createPayment(req, res);    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockInstallment.save).toHaveBeenCalled();
    // Verificar que se agregó el nuevo pago
    expect(mockInstallment.payments).toHaveLength(2);
    // Verificar que la respuesta indica éxito
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      installment: expect.any(Object),
      message: 'Se creo el pago',
    });
  });

  test('test_create_payment_with_mercadopago_success', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [],
      salesOrderCode: 'SO001',
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    const mockMercadoPagoData = {
      preference_id: 'pref123',
      auto_return: 'approved',
      items: [{ title: 'SO001', unit_price: 100 }],
    };
    getPreference.mockResolvedValue(mockMercadoPagoData);

    req.body.paymentData.paymentMethod = 'MercadoPago';
    req.body.mercadoPagoData = { preference_id: 'pref123' };

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      installment: expect.objectContaining({
        _id: 'installment123',
        amount: 200,
        salesOrderCode: 'SO001',
        payments: expect.arrayContaining([
          expect.objectContaining({
            _id: 'payment123',
            amount: 100,
          }),
        ]),
      }),
      message: 'Se creo el pago',
    }));
  });

  test('test_create_payment_with_mercadopago_not_approved', async () => {
    const mockMercadoPagoData = {
      preference_id: 'pref123',
      auto_return: 'pending',
    };
    getPreference.mockResolvedValue(mockMercadoPagoData);

    req.body.paymentData.paymentMethod = 'MercadoPago';
    req.body.mercadoPagoData = { preference_id: 'pref123' };

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Los datos de mercado pago no coinciden con los datos de la cuota',
    });
  });

  test('test_create_payment_with_mercadopago_duplicate_payment', async () => {
    const mockInstallment = {
      _id: 'installment123',
      amount: 200,
      payments: [{ mercadoPagoData: { preference_id: 'pref123' } }],
      save: jest.fn().mockImplementation(function() { return Promise.resolve(this); }),
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    const mockMercadoPagoData = {
      preference_id: 'pref123',
      auto_return: 'approved',
    };
    getPreference.mockResolvedValue(mockMercadoPagoData);

    req.body.paymentData.paymentMethod = 'MercadoPago';
    req.body.mercadoPagoData = { preference_id: 'pref123' };

    await createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El pago ya fue procesado anteriormente',
    });
  });
});
