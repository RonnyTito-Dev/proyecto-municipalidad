// routes/requestForwardHistoryRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de historial de derivaciones
const requestForwardHistoryController = require('../controllers/requestForwardHistoryController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todo el historial de derivaciones
router.get('/', requestForwardHistoryController.getAllForwards);

// Obtener historial de derivaciones activas
router.get('/activos', requestForwardHistoryController.getActiveForwards);

// Obtener historial de derivaciones eliminadas
router.get('/eliminados', requestForwardHistoryController.getDeletedForwards);

// Obtener historial por código de solicitud
router.get('/codigo/:code', requestForwardHistoryController.getForwardsByRequestCode);

// Obtener una derivación por ID
router.get('/:id', requestForwardHistoryController.getForwardById);

// ======================================= SOLICITUD POST =======================================

// Crear nueva derivación en el historial
router.post('/', requestForwardHistoryController.createForward);

// ======================================= SOLICITUD PUT =======================================

// Actualizar una derivación
router.put('/:id', requestForwardHistoryController.updateForward);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de una derivación
router.delete('/:id', requestForwardHistoryController.deleteForward);

// Exportamos el router
module.exports = router;
