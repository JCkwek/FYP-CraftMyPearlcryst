const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminCheck = require('../middleware/adminCheck');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// admin 
router.post('/admin', authMiddleware, adminCheck,productController.createProduct);

module.exports = router;