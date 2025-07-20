const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Check for required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.warn('Application may not function properly without these variables');
  // Don't exit in production, just warn
}

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const swapRoutes = require('./routes/swaps');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

const app = express();

// Simple health check route - should work even if DB is down
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL] 
      : ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    const size = JSON.stringify(req.body).length;
    if (size > 1000000) { // Log if request is larger than 1MB
      console.log(`Large request detected: ${req.method} ${req.url} - Size: ${(size / 1024 / 1024).toFixed(2)}MB`);
    }
  }
  next();
});

// Make io instance available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room for private notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB (don't block server startup)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.error('MONGO_URI:', process.env.MONGO_URI ? 'Set (length: ' + process.env.MONGO_URI.length + ')' : 'Not set');
    console.log('🚀 Server will continue without MongoDB');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // Basic route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Skill Swap API is running!' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Start server
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

console.log('🚀 Starting server...');
console.log('📋 Configuration:');
console.log(`   - PORT: ${PORT}`);
console.log(`   - HOST: ${host}`);
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   - MONGO_URI: ${process.env.MONGO_URI ? 'Set ✅' : 'Missing ❌'}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'Set ✅' : 'Missing ❌'}`);

server.listen(PORT, host, () => {
  console.log(`✅ Server is running on ${host}:${PORT}`);
  console.log(`🌐 Health check: http://${host}:${PORT}/health`);
  console.log(`📚 API endpoints: http://${host}:${PORT}/api/`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  console.error('Error details:', {
    code: err.code,
    errno: err.errno,
    syscall: err.syscall,
    address: err.address,
    port: err.port
  });
  process.exit(1);
});
