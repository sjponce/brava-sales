const mongoose = require('mongoose');
const createMPLink = require('./createMPLink');
const { createPreference } = require('@/config/mercadoPagoConfig');

jest.mock('mongoose', () => {
  const mInstallment = {
    findById: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };
  return {
    model: jest.fn().mockReturnValue(mInstallment),
  };
});

jest.mock('@/config/mercadoPagoConfig', () => ({
  createPreference: jest.fn(),
}));

describe('createMPLink', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        installmentId: 'installment123',
        paymentData: {
          amount: 100,
        },
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.MP_REDIRECT_URL = 'http://example.com';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test_create_mp_link_success', async () => {
    const mockInstallment = {
      _id: 'installment123',
      salesOrderCode: 'SO001',
      salesOrder: 'order123',
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    const mockPreference = {
      init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789',
    };
    createPreference.mockResolvedValue(mockPreference);

    await createMPLink(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      redirectUrl: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789',
      message: 'Se genero el link de pago',
    });
  });

  test('test_create_mp_link_installment_not_found', async () => {
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(null);

    await expect(createMPLink(req, res)).rejects.toThrow('No se encontró la cuota');

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('test_create_mp_link_preference_creation_fails', async () => {
    const mockInstallment = {
      _id: 'installment123',
      salesOrderCode: 'SO001',
      salesOrder: 'order123',
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    createPreference.mockRejectedValue(new Error('MercadoPago API error'));

    await createMPLink(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se pudo generar el link de MP',
      error: 'MercadoPago API error',
    });
  });

  test('test_create_mp_link_correct_preference_body', async () => {
    const mockInstallment = {
      _id: 'installment123',
      salesOrderCode: 'SO001',
      salesOrder: 'order123',
    };
    mongoose.model('Installment').findById().populate().exec.mockResolvedValue(mockInstallment);

    createPreference.mockImplementation((body) => {
      expect(body).toEqual({
        items: [
          {
            title: 'SO001',
            quantity: 1,
            unit_price: 100,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success:
            'http://example.com/success?salesOrder=order123&installment=installment123&amount=100',
          failure:
            'http://example.com/failure?salesOrder=order123&installment=installment123&amount=100',
          pending:
            'http://example.com/pending?salesOrder=order123&installment=installment123&amount=100',
        },
        auto_return: 'approved',
      });
      return Promise.resolve({
        init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789',
      });
    });

    await createMPLink(req, res);

    expect(createPreference).toHaveBeenCalled();
  });
});
