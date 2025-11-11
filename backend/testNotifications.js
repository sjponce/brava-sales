#!/usr/bin/env node

/**
 * Script para probar las notificaciones del sistema
 * Ejecutar con: node testNotifications.js
 */

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Configurar conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Configurar axios para las pruebas
const baseURL = `http://localhost:${process.env.PORT || 8080}/api`;

const testAPI = async (endpoint, description, data = {}) => {
  try {
    console.log(`\n🧪 Probando: ${description}`);
    
    // Aquí necesitarías un token válido de admin
    // Para simplificar, asumimos que tienes uno
    const response = await axios.post(`${baseURL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${YOUR_ADMIN_TOKEN}` // Descomentar con token real
      },
      // O usar cookies si estás autenticado
      withCredentials: true
    });

    if (response.data.success) {
      console.log(`✅ ${description} - EXITOSO`);
    } else {
      console.log(`❌ ${description} - FALLIDO:`, response.data.message);
    }
  } catch (error) {
    console.log(`❌ ${description} - ERROR:`, error.response?.data?.message || error.message);
  }
};

const runTests = async () => {
  console.log('🚀 Iniciando pruebas de notificaciones...\n');

  // Pruebas individuales de notificaciones
  await testAPI('/test-notifications/test/order-status-changed', 'Cambio de estado de orden');
  await testAPI('/test-notifications/test/payment-received', 'Pago recibido');
  await testAPI('/test-notifications/test/stock-reserved', 'Stock reservado');
  await testAPI('/test-notifications/test/stock-shipped', 'Envío realizado');
  await testAPI('/test-notifications/test/customer-registered', 'Cliente registrado');
  await testAPI('/test-notifications/test/payment-overdue', 'Pago vencido');
  await testAPI('/test-notifications/test/installment-due', 'Cuota próxima a vencer');
  
  // Probar el job de cron
  await testAPI('/test-notifications/test/payment-job', 'Job de pagos vencidos (Cron)');

  console.log('\n🏁 Pruebas completadas');
};

// Función para probar job de cron manualmente
const testCronJob = async () => {
  console.log('🔄 Probando job de cron manualmente...\n');
  
  try {
    // Importar y ejecutar el job directamente
    const PaymentNotificationJob = require('./src/jobs/PaymentNotificationJob');
    await PaymentNotificationJob.run();
    console.log('✅ Job de cron ejecutado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando job de cron:', error);
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--cron-only')) {
      await testCronJob();
    } else if (args.includes('--api-only')) {
      await runTests();
    } else {
      // Ejecutar ambos
      await runTests();
      console.log('\n' + '='.repeat(50));
      await testCronJob();
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n👋 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ayuda
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📋 Uso: node testNotifications.js [opciones]

Opciones:
  --api-only      Solo probar endpoints de API
  --cron-only     Solo probar job de cron
  --help, -h      Mostrar esta ayuda

Sin opciones:    Probar todo (API + cron)

📝 Notas:
- Asegúrate de que el servidor esté corriendo
- Necesitas estar autenticado como admin
- Las notificaciones se crearán con datos simulados
  `);
  process.exit(0);
}

main();
