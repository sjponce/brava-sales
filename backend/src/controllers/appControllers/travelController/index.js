const mongoose = require('mongoose');
const axios = require('axios');
const Travel = mongoose.model('Travel');
const Vehicle = mongoose.model('Vehicle');
const SalesOrder = mongoose.model('SalesOrder');

const computeBultosFromItems = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const sizes = Array.isArray(item.sizes) ? item.sizes : [];
    const qty = sizes.reduce((s, sz) => s + (Number(sz.quantity) || 0), 0);
    return sum + qty;
  }, 0);
};

const computeBultosFromTravel = (travel) => {
  const itemsBultos = computeBultosFromItems(travel.items || []);
  const extraBultos = computeBultosFromItems(travel.extraStockItems || []);
  return itemsBultos + extraBultos;
};

const create = async (req, res) => {
  const {
    startDate,
    endDate,
    vehicleId,
    driverName,
    stops = [],
    useExtraStock = false,
    extraStockItems = [],
  } = req.body;

  if (!startDate || !endDate || !vehicleId) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'startDate, endDate y vehicleId son requeridos',
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Las fechas no son válidas (startDate <= endDate)',
    });
  }

  const vehicle = await Vehicle.findById(vehicleId).exec();
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Vehículo no encontrado',
    });
  }

  const travelDoc = new Travel({
    startDate: start,
    endDate: end,
    vehicle: vehicle._id,
    driverName: driverName || vehicle?.driver?.name,
    capacityBultos: vehicle.capacityBultos,
    useExtraStock: !!useExtraStock,
    extraStockItems: Array.isArray(extraStockItems) ? extraStockItems : [],
    stops: (stops || []).map((s, idx) => ({
      sequence: typeof s.sequence === 'number' ? s.sequence : idx,
      name: s.name,
      address: s.address,
      customer: s.customer,
    })),
    status: 'PLANNED',
  });

  await travelDoc.save();

  return res.status(201).json({
    success: true,
    result: travelDoc,
    message: 'Viaje creado',
  });
};

const getAxiosOptions = (cookie) => {
  const options = { headers: { cookie } };
  try {
    if (process.env.NODE_ENV !== 'production') {
      // Allow self-signed certs in local/dev
      const https = require('https');
      options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    }
  } catch (_) {
    // no-op
  }
  return options;
};

const assignOrders = async (req, res) => {
  const { id } = req.params;
  const { orderIds = [] } = req.body;
  const cookie = `token=${req.cookies.token}`;

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'orderIds es requerido y debe ser un arreglo',
    });
  }

  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }

  if (travel.status !== 'PLANNED') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Solo se pueden asignar pedidos cuando el viaje está en estado PLANNED',
    });
  }

  // Validar que las órdenes existen y están PENDING, y que no están asignadas a otro viaje RESERVED/IN_TRANSIT
  const orders = await SalesOrder.find({ _id: { $in: orderIds } }).exec();
  if (orders.length !== orderIds.length) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Una o más órdenes no existen',
    });
  }

  const invalidStatus = orders.filter((o) => o.status !== 'Pending');
  if (invalidStatus.length > 0) {
    return res.status(400).json({
      success: false,
      result: invalidStatus.map((o) => ({ id: o._id, status: o.status })),
      message: 'Todas las órdenes deben estar en estado PENDING',
    });
  }

  const conflictTravels = await Travel.find({
    status: { $in: ['RESERVED', 'IN_TRANSIT'] },
    assignedOrders: { $in: orderIds },
    _id: { $ne: travel._id },
  }).select('_id').lean();
  if (conflictTravels.length > 0) {
    return res.status(400).json({
      success: false,
      result: conflictTravels,
      message: 'Una o más órdenes ya están asignadas a un viaje en curso',
    });
  }

  // Validar stock disponible consultando al API de stock por cada idStock involucrado
  const stockIds = [];
  orders.forEach((order) => {
    (order.products || []).forEach((p) => {
      if (!stockIds.includes(p.idStock)) stockIds.push(p.idStock);
    });
  });

  // Obtener stock actual
  const stockResponse = await axios.post(
    `${process.env.BASE_API}/stock/getStockProducts`,
    stockIds,
    getAxiosOptions(cookie)
  );
  if (stockResponse.status !== 200) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener datos de stock',
    });
  }
  const stockData = stockResponse.data.result || {};

  // Construir items del viaje y validar faltantes
  const missingItems = [];
  const newTravelItems = [];
  const movementDetails = [];

  for (const order of orders) {
    for (const prod of order.products || []) {
      const sizes = [];
      for (const sz of prod.sizes || []) {
        const availableSize = (stockData[prod.idStock] || []).find((s) => s.number === Number(sz.size));
        const availableQty = availableSize ? Number(availableSize.stock) : 0;
        if (availableQty < Number(sz.quantity)) {
          missingItems.push({
            orderId: order._id,
            idStock: prod.idStock,
            color: prod.color,
            size: sz.size,
            requested: Number(sz.quantity),
            available: availableQty,
          });
        }
        sizes.push({
          size: sz.size,
          quantity: Number(sz.quantity),
        });
        movementDetails.push({
          productId: prod.idStock,
          number: Number(sz.size),
          quantity: Number(sz.quantity),
        });
      }
      newTravelItems.push({
        salesOrder: order._id,
        product: prod.product,
        idStock: prod.idStock,
        color: prod.color,
        sizes,
      });
    }
  }

  if (missingItems.length > 0 && !travel.useExtraStock) {
    return res.status(400).json({
      success: false,
      result: { missingItems },
      message: 'Faltante de stock para algunos items',
    });
  }

  // Validación de capacidad (bultos)
  const requestedBultos = computeBultosFromItems(newTravelItems);
  const currentBultos = computeBultosFromTravel(travel);
  const totalBultos = requestedBultos + currentBultos;
  if (totalBultos > travel.capacityBultos) {
    return res.status(400).json({
      success: false,
      result: { requestedBultos, currentBultos, capacityBultos: travel.capacityBultos },
      message: 'La cantidad total de bultos excede la capacidad del vehículo',
    });
  }

  // Registrar movimiento de stock (salida/reserva)
  const movementData = {
    type: 'output',
    details: movementDetails,
  };
  const responseMovement = await axios.post(
    `${process.env.BASE_API}/stock/movement`,
    movementData,
    getAxiosOptions(cookie)
  );
  if (responseMovement.status !== 200) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al registrar movimiento de stock',
    });
  }

  // Persistir asignaciones
  travel.items = [...(travel.items || []), ...newTravelItems];
  travel.assignedOrders = Array.from(new Set([...(travel.assignedOrders || []), ...orderIds.map((x) => x.toString())]));
  travel.status = 'RESERVED';
  travel.reservedAt = new Date();
  travel.ttlReleaseAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  await travel.save();

  return res.status(200).json({
    success: true,
    result: await Travel.findById(travel._id).exec(),
    message: 'Pedidos asignados y stock reservado',
  });
};

const getDetails = async (req, res) => {
  const { id } = req.params;
  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  return res.status(200).json({
    success: true,
    result: travel,
    message: 'Detalles del viaje',
  });
};

const start = async (req, res) => {
  const { id } = req.params;
  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  if (travel.status !== 'RESERVED') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El viaje debe estar en estado RESERVED',
    });
  }
  travel.status = 'IN_TRANSIT';
  travel.startedAt = new Date();
  await travel.save();
  return res.status(200).json({
    success: true,
    result: travel,
    message: 'Viaje iniciado',
  });
};

const arriveStop = async (req, res) => {
  const { id, stopId } = req.params;
  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  const stop = (travel.stops || []).find((s) => String(s._id) === String(stopId));
  if (!stop) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Parada no encontrada',
    });
  }
  stop.arrivedAt = new Date();
  await travel.save();
  return res.status(200).json({
    success: true,
    result: travel,
    message: 'Arribo a parada registrado',
  });
};

const recordDeliveries = async (req, res) => {
  const { id } = req.params;
  const { deliveries = [] } = req.body;

  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  if (travel.status !== 'IN_TRANSIT') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El viaje debe estar en estado IN_TRANSIT para registrar entregas',
    });
  }

  // deliveries: [{ salesOrderId, idStock, size, quantity }]
  deliveries.forEach((d) => {
    const item = (travel.items || []).find((it) => String(it.salesOrder) === String(d.salesOrderId) && it.idStock === d.idStock);
    if (!item) return;
    const sizeRow = (item.sizes || []).find((sz) => String(sz.size) === String(d.size));
    if (!sizeRow) return;
    const planned = Number(sizeRow.quantity) || 0;
    const alreadyDelivered = Number(sizeRow.delivered) || 0;
    const alreadyFailed = Number(sizeRow.failed) || 0;
    const remaining = Math.max(planned - alreadyDelivered - alreadyFailed, 0);
    const add = Math.min(Number(d.quantity) || 0, remaining);
    sizeRow.delivered = alreadyDelivered + add;
  });

  await travel.save();
  return res.status(200).json({
    success: true,
    result: travel,
    message: 'Entregas registradas',
  });
};

const recordFailedDeliveries = async (req, res) => {
  const { id } = req.params;
  const { failures = [], reason } = req.body;

  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  if (travel.status !== 'IN_TRANSIT') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El viaje debe estar en estado IN_TRANSIT para registrar fallas',
    });
  }

  failures.forEach((f) => {
    const item = (travel.items || []).find((it) => String(it.salesOrder) === String(f.salesOrderId) && it.idStock === f.idStock);
    if (!item) return;
    const sizeRow = (item.sizes || []).find((sz) => String(sz.size) === String(f.size));
    if (!sizeRow) return;
    const planned = Number(sizeRow.quantity) || 0;
    const alreadyDelivered = Number(sizeRow.delivered) || 0;
    const alreadyFailed = Number(sizeRow.failed) || 0;
    const remaining = Math.max(planned - alreadyDelivered - alreadyFailed, 0);
    const add = Math.min(Number(f.quantity) || 0, remaining);
    sizeRow.failed = alreadyFailed + add;
  });

  // Guardar motivo en metadata simple
  travel.markModified('items');
  await travel.save();
  return res.status(200).json({
    success: true,
    result: travel,
    message: `Fallas registradas${reason ? `: ${reason}` : ''}`,
  });
};

const complete = async (req, res) => {
  const { id } = req.params;
  const cookie = `token=${req.cookies.token}`;
  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  if (travel.status !== 'IN_TRANSIT') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El viaje debe estar en estado IN_TRANSIT para finalizar',
    });
  }
  // Validar que todas las paradas fueron procesadas (arrivedAt seteado)
  const pendingStops = (travel.stops || []).filter((s) => !s.arrivedAt);
  if (pendingStops.length > 0) {
    return res.status(400).json({
      success: false,
      result: pendingStops.map((s) => ({ id: s._id, sequence: s.sequence })),
      message: 'Aún hay paradas sin procesar',
    });
  }

  // Devolver stock sobrante
  const movementDetails = [];
  (travel.items || []).forEach((it) => {
    (it.sizes || []).forEach((sz) => {
      const planned = Number(sz.quantity) || 0;
      const delivered = Number(sz.delivered) || 0;
      const failed = Number(sz.failed) || 0;
      const remaining = Math.max(planned - delivered - failed, 0);
      if (remaining > 0) {
        movementDetails.push({
          productId: it.idStock,
          number: Number(sz.size),
          quantity: remaining,
        });
      }
    });
  });
  // Extra stock también retorna
  (travel.extraStockItems || []).forEach((it) => {
    (it.sizes || []).forEach((sz) => {
      const qty = Number(sz.quantity) || 0;
      if (qty > 0) {
        movementDetails.push({
          productId: it.idStock,
          number: Number(sz.size),
          quantity: qty,
        });
      }
    });
  });

  if (movementDetails.length > 0) {
    const movementData = {
      type: 'input',
      details: movementDetails,
    };
    const responseMovement = await axios.post(
      `${process.env.BASE_API}/stock/movement`,
      movementData,
      getAxiosOptions(cookie)
    );
    if (responseMovement.status !== 200) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error al devolver stock sobrante',
      });
    }
  }

  travel.status = 'COMPLETED';
  travel.completedAt = new Date();
  await travel.save();

  return res.status(200).json({
    success: true,
    result: travel,
    message: 'Viaje finalizado',
  });
};

const addExtraStock = async (req, res) => {
  const { id } = req.params;
  const { items = [] } = req.body;
  const cookie = `token=${req.cookies.token}`;

  const travel = await Travel.findById(id).exec();
  if (!travel) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Viaje no encontrado',
    });
  }
  if (!['PLANNED', 'RESERVED'].includes(travel.status)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Solo se puede cargar stock extra con estado PLANNED o RESERVED',
    });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Debe enviar items de stock extra',
    });
  }

  // Validar disponibilidad de stock
  const idSet = new Set();
  items.forEach((it) => idSet.add(it.idStock));
  const ids = Array.from(idSet);
  const stockResponse = await axios.post(
    `${process.env.BASE_API}/stock/getStockProducts`,
    ids,
    getAxiosOptions(cookie)
  );
  if (stockResponse.status !== 200) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener datos de stock',
    });
  }
  const stockData = stockResponse.data.result || {};

  // Validar cantidades y capacidad
  const movementDetails = [];
  let requestedBultos = 0;
  for (const it of items) {
    for (const sz of it.sizes || []) {
      const availableSize = (stockData[it.idStock] || []).find((s) => s.number === Number(sz.size));
      const availableQty = availableSize ? Number(availableSize.stock) : 0;
      if (availableQty < Number(sz.quantity)) {
        return res.status(400).json({
          success: false,
          result: { idStock: it.idStock, size: sz.size, requested: Number(sz.quantity), available: availableQty },
          message: 'Faltante de stock para item extra',
        });
      }
      requestedBultos += Number(sz.quantity) || 0;
      movementDetails.push({
        productId: it.idStock,
        number: Number(sz.size),
        quantity: Number(sz.quantity),
      });
    }
  }

  const currentBultos = computeBultosFromTravel(travel);
  const totalBultos = currentBultos + requestedBultos;
  if (totalBultos > travel.capacityBultos) {
    return res.status(400).json({
      success: false,
      result: { requestedBultos, currentBultos, capacityBultos: travel.capacityBultos },
      message: 'La cantidad total de bultos excede la capacidad del vehículo',
    });
  }

  // Registrar movimiento de salida
  const responseMovement = await axios.post(
    `${process.env.BASE_API}/stock/movement`,
    { type: 'output', details: movementDetails },
    getAxiosOptions(cookie)
  );
  if (responseMovement.status !== 200) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al registrar movimiento de stock',
    });
  }

  travel.useExtraStock = true;
  travel.extraStockItems = [...(travel.extraStockItems || []), ...items];
  if (travel.status === 'PLANNED') {
    travel.status = 'RESERVED';
    travel.reservedAt = new Date();
    travel.ttlReleaseAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  }
  await travel.save();

  return res.status(200).json({
    success: true,
    result: await Travel.findById(travel._id).exec(),
    message: 'Stock extra agregado al viaje',
  });
};

const listAll = async (req, res) => {
  const sort = req.query.sort || 'desc';
  const enabled = req.query.enabled || undefined;

  const query = { removed: false };
  if (enabled !== undefined) query.enabled = enabled;

  const sortField = sort === 'asc' ? 1 : -1;
  const result = await Travel.find(query).sort({ createdAt: sortField }).populate().exec();

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Se encontro todos los elementos',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'La colección esta vacia',
    });
  }
};

const remove = async (req, res) => {
  const updates = { removed: true };
  const result = await Travel.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },
    { new: true }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontro el Travel',
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Se elimino el Travel',
  });
};

module.exports = {
  // custom travel flows
  create,
  assignOrders,
  getDetails,
  start,
  arriveStop,
  recordDeliveries,
  recordFailedDeliveries,
  complete,
  addExtraStock,
  // minimal CRUD used by generic /api/travel routes
  listAll,
  delete: remove,
};


