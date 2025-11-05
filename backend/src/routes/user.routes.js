const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');

// Rutas públicas
router.post('/register', registerValidation, UserController.register);
router.post('/login', loginValidation, UserController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;
