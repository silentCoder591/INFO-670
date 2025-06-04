const mongoose = require('mongoose');
const PurchaseOrder = require('./models/PurchaseOrder');
require('dotenv').config();

const samplePurchaseOrders = [
  {
    poNumber: '4500009285',
    orderDate: new Date('2024-03-15'),
    supplier: 'ABC Supplies',
    status: 'Pending',
    totalAmount: 7500,
    itemName: 'Laptop',
    quantity: 5,
    unitPrice: 1200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    poNumber: '4500009286',
    orderDate: new Date('2024-03-16'),
    supplier: 'XYZ Electronics',
    status: 'Approved',
    totalAmount: 750,
    itemName: 'Keyboard',
    quantity: 10,
    unitPrice: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    poNumber: '4500009287',
    orderDate: new Date('2024-03-17'),
    supplier: 'Tech Solutions',
    status: 'Delivered',
    totalAmount: 2000,
    itemName: 'Headphones',
    quantity: 20,
    unitPrice: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supplychain');
    console.log('Connected to MongoDB');

    // Clear existing data
    await PurchaseOrder.deleteMany({});
    console.log('Cleared existing purchase orders');

    // Insert sample data
    await PurchaseOrder.insertMany(samplePurchaseOrders);
    console.log('Inserted sample purchase orders');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the setup
setupDatabase(); 