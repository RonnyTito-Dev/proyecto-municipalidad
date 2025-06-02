// routes/userRouter.js

// Importamos express
const express = require('express');

// Inicializamos rutas de express
const router = express.Router();

// Importamos el controlador de usuarios
const userController = require('../controllers/userController');

// Importamos el middleware auth
const authMiddleware = require('../middleware/authMiddleware');

// Proteger las rutas
router.use(authMiddleware);

// ======================================= SOLICITUD GET =======================================

// Obtener todos los usuarios (activos e inactivos)
router.get('/', userController.getUsers);

// Obtener solo usuarios activos
router.get('/activos', userController.getActiveUsers);

// Obtener solo usuarios eliminados
router.get('/eliminados', userController.getDeletedUsers);

// Obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Obtener un usuario por email
router.get('/email/:email', userController.getUserByEmail);

// Obtener un usuario por DNI
router.get('/dni/:dni', userController.getUserByDni);

// Obtener un usuario por número de celular
router.get('/celular/:celular', userController.getUserByPhone);

// ======================================= SOLICITUD POST =======================================

// Crear un nuevo usuario
router.post('/', userController.createUser);

// ======================================= SOLICITUD PUT =======================================

// Actualizar datos personales del usuario
router.put('/:id/datos', userController.updateUserData);

// Actualizar contraseña del usuario
router.put('/:id/password', userController.updateUserPassword);

// Actualizar PIN del usuario
router.put('/:id/pin', userController.updateUserPin);

// Cambiar el área asignada al usuario
router.put('/:id/area', userController.updateUserArea);

// Cambiar el estado del usuario
router.put('/:id/estado', userController.updateUserState);

// ======================================= SOLICITUD DELETE =======================================

// Eliminar un usuario (eliminación lógica)
router.delete('/:id', userController.deleteUser);

// Exportamos el router
module.exports = router;
