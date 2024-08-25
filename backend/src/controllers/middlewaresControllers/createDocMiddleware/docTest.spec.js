const { createDocx } = require('@/helpers/documentHelper');
const docTest = require('@/controllers/middlewaresControllers/createDocMiddleware/docTest');
const httpMocks = require('node-mocks-http');

jest.mock('@/helpers/documentHelper');

describe('docTest', () => {
  test('test_create_docx_and_send_response', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const mockBuffer = Buffer.from('mock document content');

    createDocx.mockReturnValue(mockBuffer);
    res.json = jest.fn();

    await docTest(req, res);

    expect(createDocx).toHaveBeenCalledWith('Test', {
      name: 'Santiago',
      lastName: ['Ponce', 'dos'],
      data: { email: 'santiago@gmail.com' },
      phone: { number: '3005555555' },
      products: [
        { name: 'Product 1', price: 12.99, quantity: 5 },
        { name: 'Product 2', price: 15.99, quantity: 3 },
        { name: 'Product 3', price: 7.99, quantity: 8 },
      ],
    });
    
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: { doc: mockBuffer, docInfo: { docName: 'Test', docExtension: 'docx' } },
      message: `El documento se ha generado correctamente`,
  });

    expect(res.statusCode).toBe(200);
  });
});
