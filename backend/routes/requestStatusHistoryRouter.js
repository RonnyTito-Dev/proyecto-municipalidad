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

// Obtener todo el historial de cambios de estado (sin filtro)
router.get('/', requestStatusHistoryController.getStatusHistories);

// Obtener solo historial activo
router.get('/activos', requestStatusHistoryController.getActiveStatusHistories);

// Obtener solo historial eliminado
router.get('/eliminados', requestStatusHistoryController.getDeletedStatusHistories);

// Obtener historial por código de solicitud
router.get('/solicitud/:codigo_solicitud', requestStatusHistoryController.getStatusHistoriesByRequestCode);

// Obtener un registro del historial por ID
router.get('/:id', requestStatusHistoryController.getStatusHistoryById);

// ============================== SOLICITUD POST ==============================

// Crear un nuevo registro en historial de estados
router.post('/', requestStatusHistoryController.createStatusHistory);

// ============================== SOLICITUD PUT ==============================

// Actualizar un registro del historial por ID
router.put('/:id', requestStatusHistoryController.updateStatusHistory);

// ============================== SOLICITUD DELETE ==============================

// Eliminación lógica de un registro del historial
router.delete('/:id', requestStatusHistoryController.deleteStatusHistory);

// Exportamos el router
module.exports = router;
