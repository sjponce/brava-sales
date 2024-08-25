const { createDocx } = require('@/helpers/documentHelper');
const read = require('../../middlewaresControllers/createCRUDController/read');
const { default: mongoose } = require('mongoose');

const docInstallment = async (req, res) => {
  try {
    const { id } = req.body;
    const Model = mongoose.model('Installment');
    const readResponse = await new Promise((resolve) => {
      read(Model, { params: { id } }, { status: () => ({ json: resolve }) });
    });

    if (readResponse.success && readResponse.result) {
      const installmentData = readResponse.result;
      const salesOrderData = readResponse.result.salesOrder;

      const doc = createDocx('Installment', {
        number: installmentData.installmentNumber,
        name: salesOrderData.customer.name,
        lastName: salesOrderData.customer.lastName,
        data: { email: salesOrderData.customer.email },
        phone: { number: salesOrderData.customer.phone },
        products: salesOrderData.products.map(product => ({
          name: product.product.name,
          price: product.price,
          quantity: product.quantity
        })),
      });

      return res.status(200).json({
        success: true,
        result: {
          doc,
          docInfo: { docName: 'Cuota', docExtension: 'docx' },
        },
        message: `El documento se ha generado correctamente`,
      });
    } else {
      throw new Error('Ocurrió un error al generar la cuota');
    }
  } catch (error) {
    console.error('Error generating sales order document:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrió un error al generar la cuota',
      error: error.message,
    });
  }
};

module.exports = docInstallment;
