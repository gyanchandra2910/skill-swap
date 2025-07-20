// MongoDB Connection Test for Railway
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('Environment:', process.env.NODE_ENV);
console.log('MONGO_URI provided:', process.env.MONGO_URI ? 'Yes' : 'No');

if (process.env.MONGO_URI) {
  console.log('MONGO_URI length:', process.env.MONGO_URI.length);
  console.log('MONGO_URI starts with:', process.env.MONGO_URI.substring(0, 25) + '...');
}

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://gyansuperuser:Gyan%40123@skillswap-cluster.ogd5rcr.mongodb.net/skillswap?retryWrites=true&w=majority';

console.log('🚀 Attempting to connect to MongoDB...');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('Database Name:', mongoose.connection.db.databaseName);
  console.log('Connection State:', mongoose.connection.readyState);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB Connection Failed:');
  console.error('Error Name:', error.name);
  console.error('Error Message:', error.message);
  
  if (error.reason) {
    console.error('Error Reason:', error.reason);
  }
  
  if (error.code) {
    console.error('Error Code:', error.code);
  }
  
  console.error('Full Error:', error);
  process.exit(1);
});

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('👋 MongoDB connection closed through app termination');
    process.exit(0);
  });
});
