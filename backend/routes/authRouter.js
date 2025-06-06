// routes/authRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de autenticación
const authController = require('../controllers/authController');

// Importamos middleware de autenticación para proteger rutas
const authMiddleware = require('../middleware/authMiddleware');

// ======================================= SOLICITUD POST =======================================

// Login de usuario (autenticación)
router.post('/login', authController.login);

// Cerrar sesión (logout)
router.post('/logout', authMiddleware, authController.logout);

// ======================================= SOLICITUD GET =======================================

// Obtener información del usuario actual (requiere autenticación)
router.get('/current', authMiddleware, authController.getCurrentUser);

// Exportamos el router
module.exports = router;
