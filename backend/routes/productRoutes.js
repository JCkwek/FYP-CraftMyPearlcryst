const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Main product endpoint (handles everything)
router.get('/', productController.getProducts);

// Admin endpoint 
router.get('/admin', productController.getProducts);

router.get('/:id', productController.getProductById);

module.exports = router;