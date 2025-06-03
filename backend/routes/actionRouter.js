// routes/actionRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de acciones
const actionController = require('../controllers/actionController'); 

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las acciones
router.get('/', actionController.getActions);

// Obtener solo las acciones activas
router.get('/activos', actionController.getActiveActions);

// Obtener solo las acciones eliminadas
router.get('/eliminados', actionController.getDeletedActions);

// Obtener una acción por nombre
router.get('/nombre/:nombre', actionController.getActionByName);

// Obtener una acción por ID
router.get('/:id', actionController.getActionById);


// ======================================= SOLICITUD POST =======================================

// Crear una nueva acción
router.post('/', actionController.createAction);

// ======================================= SOLICITUD PUT =======================================

// Actualizar una acción existente
router.put('/:id', actionController.updateAction);

// ======================================= SOLICITUD PATCH =======================================

// Eliminar una acción
router.patch('/:id/eliminar', actionController.deleteAction);

// Eliminar una acción
router.patch('/:id/restaurar', actionController.restoreAction);

// Exportamos el router
module.exports = router; 
