// Ejemplo de integración en el controlador create de SalesOrder
// Agregar al final del método create en backend/src/controllers/coreControllers/createSalesOrderController/create.js

const NotificationHelpers = require('../../../helpers/NotificationHelpers');

// Después de crear la orden exitosamente, antes del return:

// Populate customer data para la notificación
const populatedSalesOrder = await SalesOrder.findById(salesOrder._id)
  .populate('customer')
  .exec();

// Disparar notificación de orden creada
await NotificationHelpers.onOrderCreated(
  populatedSalesOrder, 
  salesOrderData.responsible // Usuario que creó la orden
);

// Returning successful response
return res.status(200).json({
  success: true,
  result: { salesOrder },
  message: `La Orden de venta se creó correctamente`,
});

// Para el createPayment.js, agregar después de crear el pago:
// const NotificationHelpers = require('../../../helpers/NotificationHelpers');

// // Populate datos necesarios
// const populatedInstallment = await Installment.findById(installmentId)
//   .populate({
//     path: 'salesOrder',
//     populate: {
//       path: 'customer'
//     }
//   })
//   .exec();

// // Disparar notificación de pago recibido
// await NotificationHelpers.onPaymentReceived(
//   payment,
//   populatedInstallment,
//   populatedInstallment.salesOrder,
//   req.admin._id // Usuario que procesó el pago
// );

// Para actualización de estado de orden (nuevo archivo o en update):
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     const salesOrder = await SalesOrder.findById(id).populate('customer');
//     const previousStatus = salesOrder.status;
    
//     salesOrder.status = status;
//     await salesOrder.save();
    
//     // Disparar notificación de cambio de estado
//     await NotificationHelpers.onOrderStatusChanged(
//       salesOrder,
//       previousStatus,
//       status,
//       req.admin._id
//     );
    
//     return res.status(200).json({
//       success: true,
//       result: salesOrder,
//       message: 'Estado actualizado correctamente'
//     });
//   } catch (error) {
//     // handle error
//   }
// };
