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
        code: salesOrderData.salesOrderCode,
        name: salesOrderData.customer.name,
        orderDate: salesOrderData.orderDate,
        totalAmount: salesOrderData.totalAmount,
        finalAmount: salesOrderData.finalAmount,
        email: salesOrderData.customer.email,
        documentNumber: salesOrderData.customer.documentNumber,
        address: salesOrderData.customer.address,
        number: salesOrderData.customer.number,
        discount: salesOrderData.discount,
        products: salesOrderData.products.map(product => ({
          name: product.product.stockId,
          price: product.price,
          quantity: product.sizes.quantity
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
