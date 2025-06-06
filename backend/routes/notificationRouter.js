// routes/notificationRouter.js

// Importamos express
const express = require('express');

// Inicializamos el router
const router = express.Router();

// Importamos el controlador
const notificationController = require('../controllers/notificationController');

// Importamos el middleware de autenticación
const authMiddleware = require('../middleware/authMiddleware');

// Aplicamos middleware a todas las rutas
router.use(authMiddleware);

// ======================================= RUTAS GET =======================================

// Obtener todas las notificaciones
router.get('/', notificationController.getAllNotifications);

// Obtener notificaciones por código de solicitud
router.get('/codigo-solicitud/:codigo_solicitud', notificationController.getNotificationsByRequestCode);

// Obtener una notificación por ID
router.get('/:id', notificationController.getNotificationById);

// ======================================= RUTA POST =======================================

// Crear una nueva notificación
router.post('/', notificationController.createNotification);


// Exportamos el router
module.exports = router;
