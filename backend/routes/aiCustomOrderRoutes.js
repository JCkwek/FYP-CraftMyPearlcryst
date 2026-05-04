const express = require('express');
const router = express.Router();
const aiOrderController = require('../controllers/aiCustomOrderController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/submit-quote', authMiddleware, aiOrderController.submitForQuote);
router.get('/my-aicustom-orders', authMiddleware, aiOrderController.getAiCustomOrders);
router.delete('/:orderId', authMiddleware, aiOrderController.removeAiCustomOrder);

module.exports = router;