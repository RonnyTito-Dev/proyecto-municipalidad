// routes/roleRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de roles
const roleController = require('../controllers/roleController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los roles
router.get('/', roleController.getRoles);

// Obtener solo los roles activos
router.get('/activos', roleController.getActiveRoles);

// Obtener solo los roles eliminados
router.get('/eliminados', roleController.getDeletedRoles);

// Obtener un rol por nombre
router.get('/nombre/:nombre', roleController.getRoleByName);

// Obtener un rol por ID
router.get('/:id', roleController.getRoleById);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo rol
router.post('/', roleController.createRole);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un rol existente
router.put('/:id', roleController.updateRole);

// ======================================= SOLICITUD PATCH =======================================

// Eliminar un rol
router.patch('/:id/eliminar', roleController.deleteRole);

// Restaurar un rol
router.patch('/:id/restaurar', roleController.restoreRole);

// Exportamos el router
module.exports = router;
