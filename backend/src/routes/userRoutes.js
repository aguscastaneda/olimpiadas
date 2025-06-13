const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', auth, getMe);

module.exports = router; 