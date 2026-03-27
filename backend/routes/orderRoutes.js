const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/checkout', authMiddleware, orderController.checkout);
router.get('/confirm', authMiddleware, orderController.confirmPayment);
router.get('/',authMiddleware, orderController.getMyOrders);

module.exports = router;