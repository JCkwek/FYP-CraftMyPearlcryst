const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminCheck = require('../middleware/adminCheck');

router.post('/checkout', authMiddleware, orderController.checkout);
router.post('/:orderId/pay', authMiddleware, orderController.payPendingOrder);
router.get('/confirm', authMiddleware, orderController.confirmPayment);
router.get('/',authMiddleware, orderController.getOrdersByUserId);

//admin
router.get('/admin/salesData', authMiddleware, adminCheck, orderController.getMonthlySalesData);
router.get('/admin/allOrders', authMiddleware, adminCheck, orderController.getOrders);
router.put('/admin/updateOrderStatus/:orderId', authMiddleware, adminCheck, orderController.updateOrderStatus);


module.exports = router;