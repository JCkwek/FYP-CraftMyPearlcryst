const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminCheck = require('../middleware/adminCheck');

router.post('/checkout', authMiddleware, orderController.checkout);
router.get('/confirm', authMiddleware, orderController.confirmPayment);
router.get('/',authMiddleware, orderController.getOrdersByUserId);

//admin
router.get('/admin/salesData', authMiddleware, adminCheck, orderController.getMonthlySalesData);

module.exports = router;