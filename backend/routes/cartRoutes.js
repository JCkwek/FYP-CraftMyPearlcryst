const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware);

router.post('/', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/update', cartController.updateQuantity);
router.delete('/:productId', cartController.deleteCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;