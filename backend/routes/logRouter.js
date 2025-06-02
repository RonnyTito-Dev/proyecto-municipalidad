// routes/logRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de logs
const logController = require('../controllers/logController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los log saneados
router.get('/', logController.getLogsDetailed);

// Obtener todos los log en crudo
router.get('/', logController.getLogsRaw);

// Obtener solo logs activos
router.get('/activos', logController.getActiveLogs);

// Obtener solo logs eliminados
router.get('/eliminados', logController.getDeletedLogs);

// Obtener log por ID
router.get('/:id', logController.getLogById);

// Obtener logs por usuario_id
router.get('/usuario/:usuario_id', logController.getLogsByUserId);

// Obtener logs por area_id
router.get('/area/:area_id', logController.getLogsByAreaId);

// Obtener logs por accion_id
router.get('/accion/:accion_id', logController.getLogsByActionId);

// Obtener logs por tabla_afectada
router.get('/tabla/:tabla_afectada', logController.getLogsByTable);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo log
router.post('/', logController.createLog);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un log por ID
router.put('/:id', logController.updateLog);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de un log por ID
router.delete('/:id', logController.deleteLog);

// Exportamos el router
module.exports = router;
