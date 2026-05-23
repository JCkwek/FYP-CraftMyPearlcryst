const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiCustomizationController');

router.get('/step/:step', aiController.getStepOptions);
router.post('/generate', aiController.generateImage);
router.get('/lengths', aiController.getLengths);

// Admin routes
router.get('/admin/components', aiController.getAllComponents);
// router.post('/components', aiController.createComponent);
// router.put('/components/:id', aiController.updateComponent);
// router.delete('/components/:id', aiController.deleteComponent);

module.exports = router;