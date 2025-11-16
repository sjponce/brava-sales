require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Make sure we are running node 20+
const [major] = process.versions.node.split('.').map(Number.parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version to 20 or greater. 👌\n');
  process.exit();
}

// Load .env files
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

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

// Start Express
const app = require('./app');

// ===== HTTPS CONFIG =====
// Replace with the correct path to your SSL certs (from mkcert or Let's Encrypt)
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
};

// Use environment variable for port or default to 443 for HTTPS
const PORT = process.env.PORT || 443;

const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(PORT, () => {
  console.log(`✅ HTTPS Server running → https://localhost:${PORT}`);
  NotificationScheduler.start();
});
