// controllers/userController.js

// Importamos el UserService
const userService = require('../services/userService');

class UserController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todos los usuarios
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }


    // Obtener solo usuarios habilitados para el sistema
    async getEnabledUsers(req, res, next) {
        try {
            const users = await userService.getEnabledUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo usuarios deshabilitados para el sistema
    async getDisabledUsers(req, res, next) {
        try {
            const users = await userService.getDisabledUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo usuarios no eliminados (activos)
    async getActiveUsers(req, res, next) {
        try {
            const users = await userService.getActiveUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo usuarios eliminados
    async getDeletedUsers(req, res, next) {
        try {
            const users = await userService.getDeletedUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un usuario por ID
    async getUserById(req, res, next) {
        const { id } = req.params;
        try {
            const user = await userService.getUserById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un usuario por email
    async getUserByEmail(req, res, next) {
        const { email } = req.params;
        try {
            const user = await userService.getUserByEmail(email);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un usuario por DNI
    async getUserByDni(req, res, next) {
        const { dni } = req.params;
        try {
            const user = await userService.getUserByDni(dni);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un usuario por número de celular
    async getUserByPhone(req, res, next) {
        const { celular } = req.params;
        try {
            const user = await userService.getUserByPhone(celular);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear un nuevo usuario
    async createUser(req, res, next) {
        try {
            const newUser = await userService.addUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODOS PUT ==========================================

    // Actualizar datos personales del usuario (nombres, apellidos, email, celular)
    async updateUserData(req, res, next) {
        const { id } = req.params;
        try {
            const updatedUser = await userService.updateUserData(id, req.body);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar contraseña del usuario
    async updateUserPassword(req, res, next) {
        const { id } = req.params;
        try {
            const result = await userService.updateUserPassword(id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar PIN del usuario
    async updateUserPin(req, res, next) {
        const { id } = req.params;
        try {
            const result = await userService.updateUserPin(id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Cambiar el rol al usuario
    async updateUserRol(req, res, next) {
        const { id } = req.params;
        const { rol_id } = req.body;
        try {
            const result = await userService.updateUserRol(id, rol_id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Cambiar el área asignada al usuario
    async updateUserArea(req, res, next) {
        const { id } = req.params;
        const { area_id } = req.body;
        try {
            const result = await userService.updateUserArea(id, area_id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // Cambiar el estado del usuario (activo/inactivo)
    async updateUserState(req, res, next) {
        const { id } = req.params;
        const { estado_usuario_id } = req.body;
        try {
            const result = await userService.updateUserState(id, estado_usuario_id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PATCH ==========================================

    // Eliminar un usuario logica
    async deleteUser(req, res, next) {
        const { id } = req.params;
        try {
            await userService.removeUser(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }

    // Restaurar un usuario logica
    async restoreUser(req, res, next) {
        const { id } = req.params;
        try {
            await userService.restoreUser(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new UserController();