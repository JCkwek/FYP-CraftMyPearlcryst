const express = require('express');
const router = express.Router();
const aiOrderController = require('../controllers/aiCustomOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminCheck'); 

router.post('/submit-quote', authMiddleware, aiOrderController.submitForQuote);
router.get('/my-aicustom-orders', authMiddleware, aiOrderController.getAiCustomOrdersByUserId);
router.delete('/:orderId', authMiddleware, aiOrderController.removeAiCustomOrder);

//admin
router.get('/admin/allAiCustomOrders', authMiddleware, adminCheck, aiOrderController.getAllAiCustomOrder);

module.exports = router;