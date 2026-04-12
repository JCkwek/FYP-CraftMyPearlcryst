const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiCustomizationController');

router.get('/step/:step', aiController.getStepOptions);
router.post('/generate', aiController.generateImage);
router.get('/lengths', aiController.getLengths);

module.exports = router;