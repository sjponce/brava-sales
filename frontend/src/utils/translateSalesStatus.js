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
    Overdue: 'Vencido',
    Reserved: 'Reservado',
    'Partially reserved': 'Parcialmente reservado',
    'Partially Shipped': 'Parcialmente entregado',
    Completed: 'Completado',
    PLANNED: 'Planificado',
    RESERVED: 'Reservado',
    IN_TRANSIT: 'En transito',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  };
  return translations[status] || status;
};

export default translateStatus;
