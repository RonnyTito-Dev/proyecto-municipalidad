// routes/registerStatusRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de estados de registro
const registerStatusController = require('../controllers/registerStatusController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los estados de registro
router.get('/', registerStatusController.getAllRegisterStatus);

// Obtener un estados de registro por ID
router.get('/:id', registerStatusController.getRegisterStatusById);

// Obtener un estados de registro por nombre
router.get('/nombre/:nombre', registerStatusController.getRegisterStatusByName);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo estados de registro
router.post('/', registerStatusController.createRegisterStatus);

// ======================================= SOLICITUD PUT =======================================

// Actualizar un estados de registro por ID
router.put('/:id', registerStatusController.updateRegisterStatus);


// Exportamos el router
module.exports = router;
