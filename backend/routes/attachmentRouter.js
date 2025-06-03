// routes/attachmentRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de archivos adjuntos
const attachmentController = require('../controllers/attachmentController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los archivos adjuntos
router.get('/', attachmentController.getAttachments);

// Obtener un archivo adjunto por ID
router.get('/:id', attachmentController.getAttachmentById);

// Obtener un archivo adjunto por URL
router.get('/url/:url', attachmentController.getAttachmentByURL);

// Obtener archivos adjuntos por código de solicitud
router.get('/codigo/:codigoSolicitud', attachmentController.getAttachmentsByRequestCode);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo archivo adjunto
router.post('/', attachmentController.createAttachment);


// Exportamos el router
module.exports = router;
