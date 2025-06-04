const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');

// Get all purchase orders
router.get('/', async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find();
        res.json({
            status: 'success',
            data: purchaseOrders
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching purchase orders',
            error: error.message
        });
    }
});

// Get pending purchase orders
router.get('/pending', async (req, res) => {
    try {
        const pendingOrders = await PurchaseOrder.find({ status: 'Pending' });
        res.json({
            status: 'success',
            data: pendingOrders
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching pending purchase orders',
            error: error.message
        });
    }
});

// Get purchase order by ID
router.get('/:id', async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findOne({ poNumber: req.params.id });
        if (!purchaseOrder) {
            return res.status(404).json({
                status: 'error',
                message: 'Purchase order not found'
            });
        }
        res.json({
            status: 'success',
            data: purchaseOrder
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching purchase order',
            error: error.message
        });
    }
});

// Update purchase order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['Pending', 'Approved', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
            { poNumber: req.params.id },
            { status },
            { new: true }
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                status: 'error',
                message: 'Purchase order not found'
            });
        }

        res.json({
            status: 'success',
            message: `Purchase order ${req.params.id} status updated to ${status}`,
            data: purchaseOrder
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating purchase order status',
            error: error.message
        });
    }
});

module.exports = router; 