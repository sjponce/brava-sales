const { createDocx } = require('@/helpers/documentHelper');
const read = require('../../middlewaresControllers/createCRUDController/read');
const formatDate = require('@/utils/formatDate');
const { default: mongoose } = require('mongoose');

const docInstallment = async (req, res) => {
  try {
    const { id } = req.body;
    const Model = mongoose.model('Installment');
    const Customer = mongoose.model('Customer');
    const readResponse = await new Promise((resolve) => {
      read(Model, { params: { id } }, { status: () => ({ json: resolve }) });
    });

    if (readResponse.success && readResponse.result) {
      const installmentData = readResponse.result;
      const salesOrderData = readResponse.result.salesOrder;
      const customerData = await Customer.findById(salesOrderData.customer).exec();

      const doc = createDocx('Installment', {
        code: salesOrderData.salesOrderCode,
        orderDate: formatDate(salesOrderData.orderDate),
        installmentAmount: installmentData.amount,
        installmentNumber: installmentData.installmentNumber,
        dueDate: formatDate(installmentData.dueDate),
        address: salesOrderData.shippingAddress,
        name: customerData.name,
        number: customerData.number,
        documentNumber: customerData.documentNumber,
        email: customerData.email,
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
