// routes/logRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de logs
const logController = require('../controllers/logController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los logs
router.get('/', logController.getLogs);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo log
router.post('/', logController.createLog);


// Exportamos el router
module.exports = router;
