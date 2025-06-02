// routes/documentTypeRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de tipos de documento
const documentTypeController = require('../controllers/documentTypeController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los tipos de documento
router.get('/', documentTypeController.getDocumentTypes);

// Obtener solo los tipos de documento activos
router.get('/activos', documentTypeController.getActiveDocumentTypes);

// Obtener solo los tipos de documento eliminados
router.get('/eliminados', documentTypeController.getDeletedDocumentTypes);

// Obtener un tipo de documento por ID
router.get('/:id', documentTypeController.getDocumentTypeById);

// Obtener un tipo de documento por nombre
router.get('/nombre/:nombre', documentTypeController.getDocumentTypeByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo tipo de documento
router.post('/', documentTypeController.createDocumentType);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un tipo de documento por ID
router.put('/:id', documentTypeController.updateDocumentType);

// ======================================= SOLICITUD DELETE =======================================

// Eliminación lógica de un tipo de documento
router.delete('/:id', documentTypeController.deleteDocumentType);

// Exportamos el router
module.exports = router;
