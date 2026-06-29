const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiCustomizationController');
const authMiddleware = require('../middleware/authMiddleware'); 
const uploadMiddleware = require('../middleware/uploadMiddleware');
const adminCheck = require('../middleware/adminCheck');

router.get('/step/:step', aiController.getStepOptions);
router.post('/generate', aiController.generateImage);
router.get('/lengths', aiController.getLengths);

// Admin routes
router.get('/admin/components', aiController.getAllComponents);
router.post('/admin/components',authMiddleware, adminCheck,uploadMiddleware.single('image_file'), aiController.createComponent);
router.put('/admin/components/:id', authMiddleware, adminCheck,uploadMiddleware.single('image_file'), aiController.updateComponent);
router.delete('/admin/components/:id', authMiddleware, adminCheck, aiController.deleteComponent);
router.get('/admin/requirements',authMiddleware, adminCheck,aiController.getAllRequirements);

module.exports = router;