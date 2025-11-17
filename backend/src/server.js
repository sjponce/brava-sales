/* eslint-disable no-undef */
require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Make sure we are running node 20+
const [major] = process.versions.node.split('.').map(Number.parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version to 20 or greater. 👌\n');
  process.exit();
}

// Load .env files
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Allow self-signed certificates in dev if explicitly enabled
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Connect to MongoDB
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (error) => {
  console.log('1. 🔥 Check your .env file and add your MongoDB URL');
  console.error(`2. 🚫 Error → : ${error.message}`);
});

// Load models
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Initialize scheduler
const NotificationScheduler = require('./schedulers/NotificationScheduler');
const TravelScheduler = require('./schedulers/TravelScheduler');

// Start Express
const app = require('./app');
app.set('port', process.env.PORT || 443);

// Configurar HTTPS - buscar certificados en frontend/
const certPath = path.join(__dirname, '../../frontend/localhost+2.pem');
const keyPath = path.join(__dirname, '../../frontend/localhost+2-key.pem');

let server;
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  server = https.createServer(options, app);
  console.log('🔒 HTTPS habilitado');
} else {
  // Usar require('http') para HTTP puro
  const http = require('http');
  server = http.createServer(app);
  console.log('⚠️ Certificados no encontrados, usando HTTP');
}

server.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${app.get('port')}`);

  // Iniciar el scheduler después de que el servidor esté corriendo
  NotificationScheduler.start();
  TravelScheduler.start();
});
