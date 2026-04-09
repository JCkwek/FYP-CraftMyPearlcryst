const express = require('express');
const router = express.Router();
const userController  = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);

router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;