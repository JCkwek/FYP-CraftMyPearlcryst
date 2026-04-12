const express = require('express');
const router = express.Router();
const rotateImageController = require('../controllers/rotateImageController');

router.get('/', rotateImageController.getRotateImage);

module.exports = router;