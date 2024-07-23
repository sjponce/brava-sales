const translateStatus = (status) => {
  const translations = {
    Pending: 'Pendiente',
    Processing: 'En Proceso',
    Shipped: 'Enviado',
    Delivered: 'Entregado',
    Cancelled: 'Cancelado',
  };
  return translations[status] || status;
};
export default translateStatus;
