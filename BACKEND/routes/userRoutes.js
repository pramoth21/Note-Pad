const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(authMiddleware.protect);
router.get('/profile', userController.getMe);

module.exports = router;
