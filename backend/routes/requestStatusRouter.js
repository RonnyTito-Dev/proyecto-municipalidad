// routes/requestStatusRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de estados de solicitud
const requestStatusController = require('../controllers/requestStatusController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los estados de solicitud
router.get('/', requestStatusController.getRequestStatuses);

// Obtener un estado por ID
router.get('/:id', requestStatusController.getRequestStatusById);

// Obtener un estado por nombre
router.get('/nombre/:nombre', requestStatusController.getRequestStatusByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo estado
router.post('/', requestStatusController.createRequestStatus);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un estado
router.put('/:id', requestStatusController.updateRequestStatus);


// Exportamos el router
module.exports = router;
