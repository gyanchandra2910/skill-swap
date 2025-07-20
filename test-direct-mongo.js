// Direct MongoDB connection test for Railway
const { MongoClient } = require('mongodb');

async function testDirectConnection() {
    const uri = process.env.MONGO_URI || 'mongodb+srv://gyansuperuser:Gyan%40123@skillswap-cluster.ogd5rcr.mongodb.net/skillswap?retryWrites=true&w=majority';
    
    console.log('🧪 Testing direct MongoDB connection...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('URI length:', uri.length);
    console.log('URI preview:', uri.substring(0, 50) + '...');
    
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
    });

    try {
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        
        console.log('✅ Connected successfully!');
        
        // Test database access
        const db = client.db('skillswap');
        const collections = await db.listCollections().toArray();
        console.log('📊 Database collections:', collections.map(c => c.name));
        
        // Test a simple operation
        const users = db.collection('users');
        const count = await users.countDocuments();
        console.log('👥 Users count:', count);
        
        return true;
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        console.error('Name:', error.name);
        return false;
    } finally {
        await client.close();
        console.log('🔐 Connection closed');
    }
}

// Run the test
testDirectConnection()
    .then(success => {
        console.log('🎯 Test result:', success ? 'SUCCESS' : 'FAILED');
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Test crashed:', error);
        process.exit(1);
    });
