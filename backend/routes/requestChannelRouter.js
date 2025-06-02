// routes/requestChannelRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de canales de solicitud
const requestChannelController = require('../controllers/requestChannelController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los canales de solicitud
router.get('/', requestChannelController.getRequestChannels);

// Obtener solo los canales activos
router.get('/activos', requestChannelController.getActiveRequestChannels);

// Obtener solo los canales eliminados
router.get('/eliminados', requestChannelController.getDeletedRequestChannels);

// Obtener un canal de solicitud por ID
router.get('/:id', requestChannelController.getRequestChannelById);

// Obtener un canal de solicitud por nombre
router.get('/nombre/:nombre', requestChannelController.getRequestChannelByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo canal de solicitud
router.post('/', requestChannelController.createRequestChannel);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un canal de solicitud existente
router.put('/:id', requestChannelController.updateRequestChannel);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de un canal de solicitud
router.delete('/:id', requestChannelController.deleteRequestChannel);

// Exportamos el router
module.exports = router;
