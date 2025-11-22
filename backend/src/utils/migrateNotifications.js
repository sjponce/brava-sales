/**
 * Script para migrar notificaciones existentes
 * Objetivo: Actualizar relatedEntity para que todas las notificaciones
 * relacionadas a órdenes usen SalesOrder._id
 *
 * Uso: node src/utils/migrateNotifications.js
 */

const mongoose = require('mongoose');

// Connectar primero antes de cargar modelos
async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/brava-sales';
  await mongoose.connect(mongoUri);
}

// Cargar modelos - después de conectar
async function loadModels() {
  require('../models/coreModels');
  require('../models/appModels');
}

async function migrateNotifications() {
  try {
    console.log('🔄 Iniciando migración de notificaciones...\n');
    
    // Conectar a BD
    await connectDB();
    console.log('✓ Conectado a MongoDB');

    // Cargar modelos
    await loadModels();
    console.log('✓ Modelos cargados\n');

    const Notification = mongoose.model('Notification');
    const SalesOrder = mongoose.model('SalesOrder');

    // 1. Migrar notificaciones PAYMENT_RECEIVED
    console.log('📦 Migrando PAYMENT_RECEIVED...');
    const paymentNotifs = await Notification.find({ type: 'PAYMENT_RECEIVED' });
    let paymentCount = 0;
    for (const notif of paymentNotifs) {
      if (notif.metadata?.salesOrderId) {
        notif.relatedEntity = {
          entityType: 'SalesOrder',
          entityId: notif.metadata.salesOrderId,
        };
        await notif.save();
        paymentCount += 1;
      }
    }
    console.log(`  ✓ ${paymentCount} notificaciones actualizadas\n`);

    // 2. Migrar notificaciones STOCK_RESERVED
    console.log('📦 Migrando STOCK_RESERVED...');
    const stockReservedNotifs = await Notification.find({
      type: 'STOCK_RESERVED',
    });
    let reservedCount = 0;
    for (const notif of stockReservedNotifs) {
      if (notif.metadata?.salesOrderCode) {
        const order = await SalesOrder.findOne({
          salesOrderCode: notif.metadata.salesOrderCode,
        });
        if (order) {
          notif.relatedEntity = {
            entityType: 'SalesOrder',
            entityId: order._id,
          };
          await notif.save();
          reservedCount += 1;
        }
      }
    }
    console.log(`  ✓ ${reservedCount} notificaciones actualizadas\n`);

    // 3. Migrar notificaciones STOCK_SHIPPED
    console.log('📦 Migrando STOCK_SHIPPED...');
    const stockShippedNotifs = await Notification.find({
      type: 'STOCK_SHIPPED',
    });
    let shippedCount = 0;
    for (const notif of stockShippedNotifs) {
      if (notif.metadata?.salesOrderCode) {
        const order = await SalesOrder.findOne({
          salesOrderCode: notif.metadata.salesOrderCode,
        });
        if (order) {
          notif.relatedEntity = {
            entityType: 'SalesOrder',
            entityId: order._id,
          };
          await notif.save();
          shippedCount += 1;
        }
      }
    }
    console.log(`  ✓ ${shippedCount} notificaciones actualizadas\n`);

    // 4. Migrar notificaciones PAYMENT_OVERDUE
    console.log('📦 Migrando PAYMENT_OVERDUE...');
    const overdueNotifs = await Notification.find({
      type: 'PAYMENT_OVERDUE',
    });
    let overdueCount = 0;
    for (const notif of overdueNotifs) {
      if (notif.metadata?.salesOrderCode) {
        const order = await SalesOrder.findOne({
          salesOrderCode: notif.metadata.salesOrderCode,
        });
        if (order) {
          notif.relatedEntity = {
            entityType: 'SalesOrder',
            entityId: order._id,
          };
          await notif.save();
          overdueCount += 1;
        }
      }
    }
    console.log(`  ✓ ${overdueCount} notificaciones actualizadas\n`);

    // 5. Migrar notificaciones INSTALLMENT_DUE
    console.log('📦 Migrando INSTALLMENT_DUE...');
    const dueNotifs = await Notification.find({
      type: 'INSTALLMENT_DUE',
    });
    let dueCount = 0;
    for (const notif of dueNotifs) {
      if (notif.metadata?.salesOrderCode) {
        const order = await SalesOrder.findOne({
          salesOrderCode: notif.metadata.salesOrderCode,
        });
        if (order) {
          notif.relatedEntity = {
            entityType: 'SalesOrder',
            entityId: order._id,
          };
          await notif.save();
          dueCount += 1;
        }
      }
    }
    console.log(`  ✓ ${dueCount} notificaciones actualizadas\n`);

    const totalUpdated = paymentCount + reservedCount + shippedCount + overdueCount + dueCount;
    console.log(`✅ Migración completada: ${totalUpdated} notificaciones actualizadas`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateNotifications();
