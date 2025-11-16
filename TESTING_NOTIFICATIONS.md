# Guía de testing de para las Notificaciones

## Estado Actual:

### ✅ **Notificaciones Implementadas y Conectadas**
1. **ORDER_CREATED** - Creación de órdenes
   - 📍 **Ubicación**: `createSalesOrderController/create.js:127`
   - 🎯 **Se dispara**: Al crear una nueva orden de venta
   - 👥 **Destinatarios**: Admins, vendedor asignado, cliente

   **STOK_RESERVED** - stock reservado
    - 📍 **Ubicación**: `createStockOrderController/create.js:89`
    - 🎯 **Se dispara**: Al reservar stock para una orden
    - 👥 **Destinatarios**: Admins, vendedor asignado

### ✅ **Notificaciones con Cron Jobs**
2. **PAYMENT_OVERDUE** - Pagos vencidos
   - 📍 **Ubicación**: `jobs/PaymentNotificationJob.js:61`
   - 🎯 **Se dispara**: Job automático diario
   - ⏰ **Frecuencia**: Semanal

3. **INSTALLMENT_DUE** - Cuotas próximas a vencer
   - 📍 **Ubicación**: `jobs/PaymentNotificationJob.js:104` 
   - 🎯 **Se dispara**: Job automático diario
   - ⏰ **Frecuencia**: 3 días antes del vencimiento

### 🔧 **Notificaciones Implementadas pero SIN CONECTAR**
5. **PAYMENT_RECEIVED** - Pago recibido
4. **ORDER_STATUS_CHANGED** - Cambio de estado
7. **STOCK_SHIPPED** - Envío realizado
8. ~~**CUSTOMER_REGISTERED** - Cliente registrado~~
9. ~~**SELLER_ASSIGNED** - Vendedor asignado~~

---

## 🧪 Métodos para Probar las Notificaciones

### 1. **🎯 Usando Endpoints de Testing (terminal o postman)**

Agregué endpoints especiales para probar cada tipo de notificación:

```bash

# 1. Cambio de estado de orden
curl -X POST https://localhost:443/api/test-notifications/test/order-status-changed \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 2. Pago recibido
curl -X POST https://localhost:443/api/test-notifications/test/payment-received \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 3. Stock reservado
curl -X POST https://localhost:443/api/test-notifications/test/stock-reserved \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 4. Envío realizado  
curl -X POST https://localhost:443/api/test-notifications/test/stock-shipped \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 5. Cliente registrado
curl -X POST https://localhost:443/api/test-notifications/test/customer-registered \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 6. Pago vencido (simula datos vencidos)
curl -X POST https://localhost:443/api/test-notifications/test/payment-overdue \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 7. Cuota próxima a vencer
curl -X POST https://localhost:443/api/test-notifications/test/installment-due \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"

# 8. Ejecutar job de cron manualmente
curl -X POST https://localhost:443/api/test-notifications/test/payment-job \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TU_TOKEN_ADMIN"
```

### 2. **🤖 Usando Script Automatizado**

```bash
# Ejecutar todas las pruebas
node testNotifications.js

# Solo probar APIs
node testNotifications.js --api-only

# Solo probar cron job
node testNotifications.js --cron-only

# Ver ayuda
node testNotifications.js --help
```

### 3. **🔄 Probando Cron Jobs**

#### Opción A: Ejecutar manualmente
```bash
# Desde el backend directory
node -e "
const mongoose = require('mongoose');
const PaymentNotificationJob = require('./src/jobs/PaymentNotificationJob');

mongoose.connect(process.env.DATABASE).then(async () => {
  console.log('Ejecutando job de pagos...');
  await PaymentNotificationJob.run();
  console.log('Job completado');
  process.exit(0);
});
"
```

#### Opción B: Cambiar frecuencia temporalmente
En `server.js`, cambiar el cron a cada minuto para testing:
```javascript
// Cambiar de:
cron.schedule('0 9 * * *', async () => { // Diario a las 9 AM

// A:
cron.schedule('* * * * *', async () => { // Cada minuto
```

OPCIONAL: Activar modo testing en `PaymentNotificationJob.js` para enviar todas las notificaciones:
```javascript
const shouldSendNotification = true; // TESTING MODE
// const shouldSendNotification = daysSinceCreated % 7 === 0 || daysSinceCreated === 0; // PRODUCTION MODE
```

---

## 🔧 Integraciones Faltantes

### 1. **PAYMENT_RECEIVED** - En controlador de pagos
```javascript
// En el controlador donde se procesa un pago
const NotificationHelpers = require('../helpers/NotificationHelpers');

// Después de procesar el pago exitosamente:
await NotificationHelpers.onPaymentReceived(
  payment,
  installment, 
  salesOrder,
  req.admin?._id || req.user?._id
);
```

### 2. **ORDER_STATUS_CHANGED** - En controlador de órdenes
```javascript
// Cuando se actualiza el estado de una orden
await NotificationHelpers.onOrderStatusChanged(
  salesOrder,
  previousStatus,
  newStatus,
  req.admin?._id || req.user?._id
);
```

### 3. **STOCK_SHIPPED** - En controlador de envíos
```javascript
// Cuando se marca como enviado
await NotificationHelpers.onStockShipped(
  stockReservation,
  salesOrder,
  req.admin?._id || req.user?._id
);
```

~~### 4. **CUSTOMER_REGISTERED** - En registro de clientes~~
```javascript
// Después de crear un cliente exitosamente
await NotificationHelpers.onCustomerRegistered(
  customer,
  req.admin?._id || req.user?._id
);
```

---

## 🚨 Notas Importantes

1. **🔒 Autenticación**: Todos los endpoints requieren autenticación de admin
2. **📧 Datos Simulados**: Los endpoints de testing usan datos ficticios
3. **🗑️ Limpieza**: Recuerda remover endpoints de testing en producción
4. **📊 Logs**: Revisa la consola del backend para ver el progreso
5. **⚡ Performance**: Los cron jobs están optimizados para evitar spam
