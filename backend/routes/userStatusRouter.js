// routes/userStatusRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de estados de usuario
const userStatusController = require('../controllers/userStatusController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los estados de usuario
router.get('/', userStatusController.getStatuses);

// Obtener solo estados activos
router.get('/activos', userStatusController.getActiveStatuses);

// Obtener solo estados eliminados
router.get('/eliminados', userStatusController.getDeletedStatuses);

// Obtener un estado por ID
router.get('/:id', userStatusController.getStatusById);

// Obtener un estado por nombre
router.get('/nombre/:nombre', userStatusController.getStatusByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo estado de usuario
router.post('/', userStatusController.createStatus);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un estado de usuario
router.put('/:id', userStatusController.updateStatus);

// ======================================= SOLICITUD PATCH =======================================

// Eliminar un estado (eliminación lógica)
router.patch('/:id/eliminar', userStatusController.deleteStatus);

// Restaurar un estado (restauracion lógica)
router.patch('/:id/restaurar', userStatusController.restoreStatus);

// Exportamos el router
module.exports = router;
