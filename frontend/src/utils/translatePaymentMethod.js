const translatePaymentMethod = (method) => {
  const paymentMethod = {
    Deposit: 'Deposito',
    'Debit Card': 'Tarjeta de Debito',
    'Credit Card': 'Tarjeta de Credito',
  };
  return paymentMethod[method] || method;
};

export default translatePaymentMethod;
