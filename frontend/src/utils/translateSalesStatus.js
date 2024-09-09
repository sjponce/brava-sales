const translateStatus = (status) => {
  const translations = {
    Pending: 'Pendiente',
    Processing: 'En Proceso',
    Shipped: 'Enviado',
    Delivered: 'Entregado',
    Cancelled: 'Cancelado',
    Paid: 'Pagado',
    Approved: 'Aprobado',
    Rejected: 'Rechazado',
    OverDue: 'Vencido',
  };
  return translations[status] || status;
};

export default translateStatus;
