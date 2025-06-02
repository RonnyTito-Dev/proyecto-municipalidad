// routes/areaRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de áreas
const areaController = require('../controllers/areaController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las áreas
router.get('/', areaController.getAreas);

// Obtener solo las áreas activas
router.get('/activos', areaController.getActiveAreas);

// Obtener solo las áreas eliminadas
router.get('/eliminados', areaController.getDeletedAreas);

// Obtener un área por ID
router.get('/:id', areaController.getAreaById);

// Obtener un área por nombre
router.get('/nombre/:nombre', areaController.getAreaByName);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva área
router.post('/', areaController.createArea);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un área existente
router.put('/:id', areaController.updateArea);

// ======================================= SOLICITUD DELETE =======================================

// Eliminar un área
router.delete('/:id', areaController.deleteArea);

// Exportamos el router
module.exports = router;
