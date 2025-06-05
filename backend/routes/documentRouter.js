// routes/documentRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de documentos
const documentController = require('../controllers/documentController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los documentos
router.get('/', documentController.getDocuments);

// Obtener un documento por ID
router.get('/:id', documentController.getDocumentById);

// Obtener un documento por URL
router.get('/url/:url', documentController.getDocumentByURL);

// Obtener documentos por código de solicitud
router.get('/codigo-solicitud/:codigoSolicitud', documentController.getDocumentsByRequestCode);

// Obtener documentos por tipo de documento
router.get('/tipo-documento/:tipoDocumentoId', documentController.getDocumentsByDocumentType);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo documento
router.post('/', documentController.createDocument);


// Exportamos el router
module.exports = router;
