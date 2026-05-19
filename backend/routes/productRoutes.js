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
router.put('/admin/editProduct/:id', authMiddleware, adminCheck, uploadMiddleware.single('product_image'),productController.updateProduct);

module.exports = router;