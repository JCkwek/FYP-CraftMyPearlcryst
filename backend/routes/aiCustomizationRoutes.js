const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiCustomizationController');

router.get('/step/:step', aiController.getStepOptions);
router.post('/generate', aiController.generateImage);
router.get('/lengths', aiController.getLengths);

// Admin routes
router.get('/admin/components', aiController.getAllComponents);
router.post('/admin/components', aiController.createComponent);
router.put('/admin/components/:id', aiController.updateComponent);
// router.delete('/components/:id', aiController.deleteComponent);
router.get('/admin/requirements',aiController.getAllRequirements);

module.exports = router;