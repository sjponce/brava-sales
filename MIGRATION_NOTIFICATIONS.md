# Migración de Notificaciones

## Problema Resuelto

Las notificaciones existentes en la BD tienen `relatedEntity` inconsistente:
- Algunas usan `entityType: 'Payment'` en lugar de `'SalesOrder'`
- Otras usan `entityType: 'StockReservation'` en lugar de `'SalesOrder'`
- Esto evita que se abra el modal al hacer click en las notificaciones

## Solución

### 1. Arreglos en el Backend

Se han actualizado los helpers para que **todas las nuevas notificaciones** usen:
```javascript
relatedEntity: {
  entityType: 'SalesOrder',
  entityId: salesOrder._id
}
```

Archivos modificados:
- `backend/src/helpers/NotificationHelpers.js`
  - `onPaymentReceived()` - ✓ Ahora usa `SalesOrder._id`
  - `onStockReserved()` - ✓ Ahora usa `SalesOrder._id`
  - `onStockShipped()` - ✓ Ahora usa `SalesOrder._id`

### 2. Migración de Datos Existentes

Para actualizar todas las notificaciones existentes en la BD:

```bash
# En la carpeta backend
node src/utils/migrateNotifications.js
```

**¿Qué hace?**
1. Se conecta a la BD
2. Busca todas las notificaciones de los tipos: `PAYMENT_RECEIVED`, `STOCK_RESERVED`, `STOCK_SHIPPED`, `PAYMENT_OVERDUE`, `INSTALLMENT_DUE`
3. Actualiza su `relatedEntity` para apuntar a `SalesOrder._id`
4. Muestra un resumen de cuántas se actualizaron

**Resultado esperado:**
```
🔄 Iniciando migración de notificaciones...

✓ Conectado a MongoDB
✓ Modelos cargados

📦 Migrando PAYMENT_RECEIVED...
  ✓ 5 notificaciones actualizadas

📦 Migrando STOCK_RESERVED...
  ✓ 3 notificaciones actualizadas

... (más tipos)

✅ Migración completada: 15 notificaciones actualizadas
```

### 3. Frontend

Las notificaciones ahora abrirán el modal correctamente cuando hagas click:

```javascript
// En NotificationCenter.jsx
onClick={() => {
  const { relatedEntity } = notification;
  if (relatedEntity?.entityType === 'SalesOrder') {
    openModal(relatedEntity.entityId);
    onClose();
  }
}}
```

## Resumen de Cambios

✅ **Backend:**
- `NotificationHelpers.js` - Arreglado `relatedEntity` en 3 métodos
- Script de migración - `migrateNotifications.js` para actualizar datos existentes

✅ **Frontend:**
- `NotificationCenter.jsx` - Click handler para abrir modal con `SalesOrder._id`

## Próximos Pasos

1. Ejecutar la migración: `node src/utils/migrateNotifications.js`
2. Probar haciendo click en notificaciones (deberían abrir el modal)
3. Crear nuevas notificaciones y verificar que funcione correctamente
