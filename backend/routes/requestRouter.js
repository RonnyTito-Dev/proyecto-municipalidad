// routes/requestRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de solicitudes
const requestController = require('../controllers/requestController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las solicitudes (sin importar estado)
router.get('/', requestController.getAllRequests);

// Obtener solo solicitudes activas
router.get('/activos', requestController.getActiveRequests);

// Obtener solo solicitudes eliminadas (lógicas)
router.get('/eliminados', requestController.getDeletedRequests);

// Obtener solicitud por código de solicitud
router.get('/codigo/:codigo', requestController.getRequestByCodigoSolicitud);

// Obtener solicitud por código de seguimiento
router.get('/seguimiento/:codigo', requestController.getRequestByCodigoSeguimiento);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva solicitud
router.post('/', requestController.createRequest);

// ======================================= SOLICITUD PUT =======================================

// Actualizar solo el estado de una solicitud
router.put('/estado/:codigo', requestController.updateRequestStatus);

// Actualizar solo el área actual de una solicitud
router.put('/area/:codigo', requestController.updateRequestArea);

// Actualizar estado y área de una solicitud
router.put('/estado-area/:codigo', requestController.updateRequestStatusAndArea);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de una solicitud
router.delete('/:codigo', requestController.deleteRequest);

// Exportamos el router
module.exports = router;
