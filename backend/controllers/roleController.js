// roleController.js

// Importamos el RoleService
const roleService = require('../services/roleService');

class RoleController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todos los roles
    async getRoles(req, res, next) {
        try {
            const roles = await roleService.getRoles();
            res.json(roles);
        } catch (error) {
            next(error);
        }
    }

    // Obtener roles activos
    async getActiveRoles(req, res, next) {
        try {
            const roles = await roleService.getActiveRoles();
            res.json(roles);
        } catch (error) {
            next(error);
        }
    }

    // Obtener roles eliminados
    async getDeletedRoles(req, res, next) {
        try {
            const roles = await roleService.getDeletedRoles();
            res.json(roles);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un rol por ID
    async getRoleById(req, res, next) {
        const { id } = req.params;

        try {
            const role = await roleService.getRoleById(id);
            res.json(role);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un rol por nombre
    async getRoleByName(req, res, next) {
        const { nombre } = req.params;

        try {
            const role = await roleService.getRoleByName(nombre);
            res.json(role);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear un nuevo rol
    async createRole(req, res, next) {
        const { nombre, descripcion } = req.body;

        try {
            const newRole = await roleService.addRole({ nombre, descripcion });
            res.status(201).json(newRole);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar un rol existente
    async updateRole(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            const updatedRole = await roleService.modifyRole(id, { nombre, descripcion });
            res.json(updatedRole);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PATCH ==========================================

    // Eliminado lógico de un rol
    async deleteRole(req, res, next) {
        const { id } = req.params;

        try {
            await roleService.removeRole(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    // Restaurar un rol eliminado
    async restoreRole(req, res, next) {
        const { id } = req.params;

        try {
            await roleService.restoreRole(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new RoleController();
