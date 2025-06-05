// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de firmas de usuario
const userSignatureController = require('../controllers/userSignatureController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todas las firmas
router.get('/', userSignatureController.getAllSignatures);

// Obtener solo las firmas activas (la que estan usando los trabajadores)
router.get('/activas', userSignatureController.getActiveSignatures);

// Obtener solo las firmas inactivas (las que no se estan usando)
router.get('/inactivas', userSignatureController.getInactiveSignatures);

// Obtener la firma activa del mismo usuario
router.get('/mi-firma/activa', userSignatureController.getActiveSignatureByUserId);

// Obtener todas las firmas del mismo usuario
router.get('/mis-firmas', userSignatureController.getAllSignaturesByUserId);

// Obtener una firma por ID
router.get('/:id', userSignatureController.getSignatureById);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva firma
router.post('/agregar-mi-firma', userSignatureController.createSignature);

// ======================================= SOLICITUD PUT =======================================

// Activar una firma y desactivar otras del mismo usuario
router.put('/mi-firma/:id/activar', userSignatureController.activateSignature);

// Desactivar todas las firmas de un usuario
router.put('/mis-firmas/desactivar', userSignatureController.deactivateAllSignaturesByUserId);

// Exportamos el router
module.exports = router;
