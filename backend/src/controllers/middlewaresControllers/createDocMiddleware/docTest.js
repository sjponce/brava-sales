const { createDocx } = require('@/helpers/documentHelper');

const docTest = async (req, res) => {
  const doc = createDocx('Test', {
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
  return res.status(200).json({
    success: true,
    result: { doc, docInfo: { docName: 'Test', docExtension: 'docx' } },
    message: `El documento se ha generado correctamente`,
  });
};

module.exports = docTest;
