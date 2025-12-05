const translateShippingMethod = (method) => {
  const paymentMethod = {
    oca: 'OCA',
    andreani: 'Andreani',
    officePickup: 'Retiro en oficina',
    tripDelivery: 'Envío con viajes',
  };
  return paymentMethod[method] || method;
};

export default translateShippingMethod;
