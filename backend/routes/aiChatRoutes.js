const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');

router.post('/chat/recommend', aiChatController.getJewelryRecommendation);

module.exports = router;