const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const PurchaseOrder = require('./models/PurchaseOrder');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/purchase-orders', purchaseOrderRoutes);

// Test endpoint to verify MongoDB data
app.get('/api/test', async (req, res) => {
    try {
        const count = await PurchaseOrder.countDocuments();
        const sampleData = await PurchaseOrder.find().limit(1);
        
        res.json({
            status: 'success',
            message: 'MongoDB is connected and working',
            data: {
                totalRecords: count,
                sampleRecord: sampleData[0] || 'No records found'
            }
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error connecting to MongoDB',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        status: 'error',
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
    console.log('Server is ready to accept connections');
}); 