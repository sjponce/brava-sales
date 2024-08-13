const translatePaymentMethod = (method) => {
  const paymentMethod = {
    Deposit: 'Depósito',
    'Debit Card': 'Tarjeta de Débito',
    'Credit Card': 'Tarjeta de Crédito',
  };
  return paymentMethod[method] || method;
};

export default translatePaymentMethod;
