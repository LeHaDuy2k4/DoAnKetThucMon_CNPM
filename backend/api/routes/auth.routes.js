const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.auth);
router.post('/logout', authMiddleware.verifyToken, authController.logout); // Thêm kiểm tra token

module.exports = router;
