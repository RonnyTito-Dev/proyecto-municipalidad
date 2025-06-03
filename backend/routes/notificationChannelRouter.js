// routes/notificationChannelRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de canales de notificación
const notificationChannelController = require('../controllers/notificationChannelController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los canales de notificación
router.get('/', notificationChannelController.getChannels);

// Obtener solo canales activos
router.get('/activos', notificationChannelController.getActiveChannels);

// Obtener solo canales eliminados (lógicos)
router.get('/eliminados', notificationChannelController.getDeletedChannels);

// Obtener canal por ID
router.get('/:id', notificationChannelController.getChannelById);

// Obtener canal por nombre
router.get('/nombre/:nombre', notificationChannelController.getChannelByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo canal de notificación
router.post('/', notificationChannelController.createChannel);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un canal de notificación por ID
router.put('/:id', notificationChannelController.updateChannel);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de un canal de notificación por ID
router.patch('/:id/eliminar', notificationChannelController.deleteChannel);

// Restauracion lógica de un canal de notificación por ID
router.patch('/:id/restaurar', notificationChannelController.restoreChannel);

// Exportamos el router
module.exports = router;
