# Notificaciones de Pagos - Sistema Brava Sales

## Descripción General

El sistema ahora notifica automáticamente a admins, vendedores y clientes en tres momentos clave del ciclo de vida de un pago:

1. **Cuando se crea un nuevo pago** (`PAYMENT_CREATED`)
2. **Cuando se aprueba un pago** (`PAYMENT_RECEIVED`)
3. **Cuando una cuota se paga completamente** (`INSTALLMENT_FULLY_PAID`)

---

## Tipos de Notificaciones Implementadas

### 1. PAYMENT_CREATED - Nuevo Pago Registrado
Se dispara **inmediatamente** cuando se registra un nuevo pago en el sistema.

**Destinatarios:**
- ✅ Todos los administradores
- ✅ Vendedor responsable de la orden
- ✅ Cliente (si requiere aprobación)

**Metadata incluida:**
```javascript
{
  salesOrderCode: "PED-001",           // Código de la orden
  customerName: "Juan Pérez",          // Nombre del cliente
  customerId: ObjectId,                // ID del cliente
  sellerId: ObjectId,                  // ID del vendedor
  amount: 500.50,                      // Monto del pago
  installmentNumber: 1,                // Número de cuota
  installmentAmount: 500.50,           // Monto de la cuota
  paymentMethod: "MercadoPago",        // Método de pago
  paymentStatus: "Pending",            // Estado del pago (Pending/Approved/Rejected)
  requiresApproval: true,              // Si requiere aprobación manual
  dueDate: Date                        // Fecha de vencimiento
}
```

**Prioridad:**
- `HIGH` si requiere aprobación manual
- `MEDIUM` si es automático (ej: Mercado Pago ya aprobado)

---

### 2. PAYMENT_RECEIVED - Pago Aprobado
Se dispara cuando un pago es **aprobado** (status = 'Approved').

**Destinatarios:**
- ✅ Todos los administradores
- ✅ Vendedor responsable

**Metadata:**
```javascript
{
  salesOrderCode: "PED-001",
  customerName: "Juan Pérez",
  customerId: ObjectId,
  sellerId: ObjectId,
  amount: 500.50,
  installmentNumber: 1,
  installmentAmount: 500.50,
  paymentMethod: "MercadoPago",
  paymentStatus: "Approved",
  dueDate: Date
}
```

**Prioridad:** `MEDIUM`

---

### 3. INSTALLMENT_FULLY_PAID - Cuota Completamente Pagada
Se dispara cuando el **total de pagos aprobados** de una cuota alcanza o supera el monto de la cuota.

**Destinatarios:**
- ✅ Todos los administradores
- ✅ Vendedor responsable
- ✅ Cliente

**Metadata:**
```javascript
{
  salesOrderCode: "PED-001",
  customerName: "Juan Pérez",
  customerId: ObjectId,
  sellerId: ObjectId,
  amount: 500.50,
  installmentNumber: 1,
  paidDate: Date  // Fecha en que se completó el pago
}
```

**Prioridad:** `LOW`

---

## Flujo de Ejecución

### Crear Pago - Mercado Pago (Automático)
```
1. Cliente realiza pago en Mercado Pago
2. Sistema recibe notificación de MP con status = 'approved'
3. createPayment.js:
   ✓ Crea el Payment con status = 'Approved'
   ✓ Dispara PAYMENT_CREATED (HIGH priority)
   ✓ Dispara PAYMENT_RECEIVED (automáticamente)
   ✓ Si la cuota se paga completamente: INSTALLMENT_FULLY_PAID
4. Notificaciones enviadas a:
   - Admins (todas)
   - Vendedor
   - Cliente (solo PAYMENT_CREATED)
```

### Crear Pago - Transferencia Bancaria (Manual)
```
1. Cliente realiza transferencia bancaria
2. Admin registra el pago manualmente con status = 'Pending'
3. createPayment.js:
   ✓ Crea el Payment con status = 'Pending'
   ✓ Dispara PAYMENT_CREATED (HIGH priority - requiere aprobación)
4. Notificaciones enviadas a:
   - Admins (todas) → Para revisión
   - Vendedor → Para seguimiento
   - Cliente → Informado del registro
5. Admin después aprueba el pago:
   ✓ Dispara PAYMENT_RECEIVED
   ✓ Si la cuota se paga completamente: INSTALLMENT_FULLY_PAID
```

---

## Configuración de Destinatarios

El sistema automáticamente determina quién debe recibir cada notificación basado en el tipo:

### Admins (siempre reciben)
- Todos los roles con `role: 'admin'` y `enabled: true`
- Para tomar decisiones de aprobación

### Vendedores (siempre reciben cuando asignados)
- Basado en `metadata.sellerId`
- Para dar seguimiento a las órdenes

### Clientes (según tipo)
- **PAYMENT_CREATED**: Sí, para informar del registro
- **PAYMENT_RECEIVED**: No (solo notificación interna)
- **INSTALLMENT_FULLY_PAID**: Sí, para confirmación

---

## Canales de Notificación

Por defecto:
- **In-App**: Siempre ✅
- **Email**: Para HIGH priority (PAYMENT_CREATED con aprobación)
- **SMS**: Para URGENT (no aplica a pagos actualmente)

---

## Integración en el Código

### 1. Crear un Pago
```javascript
// En createPayment.js - Ya implementado
const newPayment = await Payment.save();
await NotificationHelpers.onPaymentCreated(
  newPayment,
  installment,
  salesOrder,
  userId
);
```

### 2. Aprobar Manualmente un Pago
```javascript
// Si implementas un endpoint de aprobación
if (payment.status === 'Pending') {
  payment.status = 'Approved';
  await payment.save();
  
  await NotificationHelpers.onPaymentReceived(
    payment,
    installment,
    salesOrder,
    userId
  );
}
```

### 3. Monitorear Cambios en Frontend
- Notificaciones aparecen en NotificationCenter
- Badge rojo con contador de no leídas
- Tipos específicos filtrados por categoría

---

## Testing

### Script de Prueba
```bash
cd backend
node testNotifications.js --api-only
```

### Probar Manualmente
1. Crear una orden en el sistema
2. Registrar un nuevo pago (Status: Pending)
3. Verificar notificaciones en:
   - Dashboard → NotificationCenter
   - Logs del servidor
   - Base de datos: `db.notifications.find({})`

---

## Notas Importantes

⚠️ **Cambios a la Estructura:**
- `Notification.metadata` ahora incluye campos específicos de pagos
- Nuevos tipos de notificación requieren actualizar las vistas si se crean nuevas

⚠️ **Mercado Pago:**
- Los pagos de MP ya vienen con `status: 'approved'`
- Se notifica automáticamente sin requerer aprobación manual
- Solo necesita validación de datos (montos, ID orden, etc.)

✅ **Buenas Prácticas:**
- Los helpers manejan errores silenciosamente (no rompen el flujo de pagos)
- Las notificaciones se envían asincronamente (no bloquean la creación de pagos)
- Los destinatarios se determinan basados en roles (admin, vendedor, cliente)

---

## Próximas Mejoras

- [ ] Implementar notificaciones por email real
- [ ] Agregar preferencias de notificación por usuario
- [ ] Notificaciones de pagos rechazados
- [ ] Webhooks para integraciones externas
- [ ] Dashboard de historial de pagos con timeline de notificaciones
