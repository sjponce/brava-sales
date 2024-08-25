const { createDocx } = require('@/helpers/documentHelper');
const listAll = require('../../coreControllers/createSalesOrderController/listAll');

const docSalesOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const listAllResponse = await new Promise((resolve) => {
      listAll({ params: { id } }, { status: () => ({ json: resolve }) });
    });

    if (listAllResponse.success && listAllResponse.result) {
      const salesOrderData = listAllResponse.result;

      const doc = createDocx('SalesOrder', {
        code: salesOrderData.code,
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
          docInfo: { docName: 'Orden de venta', docExtension: 'docx' },
        },
        message: `El documento se ha generado correctamente`,
      });
    } else {
      throw new Error('Ocurrió un error al generar el documento de orden de venta');
    }
  } catch (error) {
    console.error('Error generating sales order document:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrió un error al generar el documento de orden de venta',
      error: error.message,
    });
  }
};

module.exports = docSalesOrder;
