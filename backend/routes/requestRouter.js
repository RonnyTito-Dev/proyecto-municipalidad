// routes/requestRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de solicitudes
const requestController = require('../controllers/requestController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');


// ========================== RUTA PÚBLICA PARA CIUDADANOS ==========================

// Obtener solicitud por código de seguimiento y PIN (ciudadano sin autenticación)
router.post('/seguimiento-ciudadano', requestController.getRequestByTrackingCodeAndPin);


// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las solicitudes (sin importar estado)
router.get('/', requestController.getAllRequests);

// Obtener solicitud por código de solicitud
router.get('/solicitud/:codigo', requestController.getRequestByRequestCode);

// Obtener solicitud por código de seguimiento
router.get('/seguimiento/:codigo', requestController.getRequestByTrackingCode);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva solicitud
router.post('/', requestController.createRequest);

// ======================================= SOLICITUD PUT =======================================

// Actualizar solo el estado de una solicitud
router.put('/estado/:codigo', requestController.updateRequestStatus);

// Actualizar solo el área actual de una solicitud
router.put('/area/:codigo', requestController.updateRequestAsignArea);

// Actualizar estado y área de una solicitud
router.put('/estado-area/:codigo', requestController.updateRequestStatusAndAsignArea);


// Exportamos el router
module.exports = router;
