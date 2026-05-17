const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminCheck = require('../middleware/adminCheck');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// admin 
router.post('/admin/addProduct', authMiddleware, adminCheck, uploadMiddleware.single('product_image'),productController.createProduct);

module.exports = router;