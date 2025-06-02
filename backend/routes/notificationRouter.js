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

// Obtener todas las notificaciones (activas e inactivas)
router.get('/', notificationController.getAllNotifications);

// Obtener solo notificaciones activas
router.get('/active', notificationController.getActiveNotifications);

// Obtener solo notificaciones eliminadas
router.get('/deleted', notificationController.getDeletedNotifications);

// Obtener notificaciones por código de solicitud
router.get('/codigo/:codigo', notificationController.getNotificationsByRequestCode);

// Obtener una notificación por ID
router.get('/:id', notificationController.getNotificationById);

// ======================================= RUTA POST =======================================

// Crear una nueva notificación
router.post('/', notificationController.createNotification);

// ======================================= RUTA PUT =======================================

// Actualizar una notificación existente
router.put('/:id', notificationController.updateNotification);

// ======================================= RUTA DELETE =======================================

// Eliminar (lógicamente) una notificación
router.delete('/:id', notificationController.deleteNotification);

// Exportamos el router
module.exports = router;
