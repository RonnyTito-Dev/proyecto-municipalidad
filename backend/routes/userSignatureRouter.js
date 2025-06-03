// routes/userSignatureRouter.js

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
router.get('/', userSignatureController.getSignatures);

// Obtener una firma por ID
router.get('/:id', userSignatureController.getSignatureById);

// Obtener una firma por ID de usuario
router.get('/usuario/:usuario_id', userSignatureController.getSignatureByUserId);

// ======================================= SOLICITUD POST =======================================

// Crear una nueva firma para un usuario
router.post('/', userSignatureController.createSignature);


// Exportamos el router
module.exports = router;
