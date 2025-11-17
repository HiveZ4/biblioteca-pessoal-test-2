const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { authenticateToken } = require('../../middleware/authMiddleware');


router.post('/register', authController.register);


router.post('/login', authController.login);


router.get('/me', authenticateToken, authController.getProfile);


router.post('/logout', authenticateToken, authController.logout);

module.exports = router;

