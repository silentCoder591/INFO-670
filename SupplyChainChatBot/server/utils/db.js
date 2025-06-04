const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supply_chain_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('\nPlease ensure MongoDB is running on your system.');
        console.log('To start MongoDB:');
        console.log('1. Open Windows Services (services.msc)');
        console.log('2. Find "MongoDB" service');
        console.log('3. Start the service if it\'s not running');
        process.exit(1);
    }
};

module.exports = connectDB; 