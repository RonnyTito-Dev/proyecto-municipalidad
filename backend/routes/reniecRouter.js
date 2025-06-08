// routes/reniecRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de Reniec
const reniecController = require('../controllers/reniecController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas con middleware de autenticación
// router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener datos de persona por DNI
router.get('/:dni', reniecController.getDataByDni);

// Exportamos el router
module.exports = router;
