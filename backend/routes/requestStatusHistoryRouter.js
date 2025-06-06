// routes/requestStatusHistoryRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador del historial de estados
const requestStatusHistoryController = require('../controllers/requestStatusHistoryController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ============================== SOLICITUD GET ==============================

// Obtener todo el historial de cambios de estado - detallado
router.get('/', requestStatusHistoryController.getStatusHistories);

// Obtener historial por código de solicitud
router.get('/solicitud/:codigo_solicitud', requestStatusHistoryController.getStatusHistoriesByRequestCode);

// Obtener historial por código de seguimiento
router.get('/seguimiento/:codigo_seguimiento', requestStatusHistoryController.getStatusHistoriesByTrackingCode);

// Obtener un registro del historial por ID
router.get('/:id', requestStatusHistoryController.getStatusHistoryById);

// ============================== SOLICITUD POST ==============================

// Crear un nuevo registro en historial de estados
router.post('/:codigo_solicitud', requestStatusHistoryController.createStatusHistory);


// Exportamos el router
module.exports = router;
