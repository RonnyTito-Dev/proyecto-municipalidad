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
router.post('/seguimiento', requestController.getRequestByTrackingCodeAndPin);


// ======================================= SOLICITUD POST =======================================

// Crear una nueva solicitud
router.post('/public', requestController.createRequest);


// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las solicitudes
router.get('/', requestController.getAllRequests);

// Obtener solicitud por código de solicitud
router.get('/solicitud/:codigo_solicitud', requestController.getRequestByRequestCode);

// Obtener solicitud por código de seguimiento
router.get('/seguimiento/:codigo_seguimiento', requestController.getRequestByTrackingCode);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva solicitud
router.post('/', requestController.createRequest);

// ======================================= SOLICITUD PUT =======================================

// // Recepcionar una solicitud
// router.put('/:codigo-solicitud/recepcionar', requestController.receiveRequest);

// // Marcar solicitud como en trabajo
// router.put('/:codigo-solicitud/trabajar', requestController.workOnRequest);

// // Derivar la solicitud a otra área
// router.put('/:codigo-solicitud/derivar', requestController.forwardRequest);

// // Aprobar o cerrar la solicitud
// router.put('/:codigo-solicitud/aprobar', requestController.approveRequest);

// // Rechazar la solicitud
// router.put('/:codigo-solicitud/rechazar', requestController.rejectRequest);

// // Anular (cancelar) la solicitud
// router.put('/:codigo-solicitud/anular', requestController.cancelRequest);


// Exportamos el router
module.exports = router;
