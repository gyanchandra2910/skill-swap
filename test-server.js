// Minimal test server for Railway debugging
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting minimal test server...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Minimal test server is working!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Keep alive
setInterval(() => {
  console.log('Server is alive, uptime:', process.uptime());
}, 30000);
