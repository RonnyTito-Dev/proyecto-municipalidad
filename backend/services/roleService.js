// roleService.js

// Importar el modelo
const roleModel = require('../models/roleModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class RoleService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los roles (sin importar estado)
    async getRoles() {
        const roles = await roleModel.getAllRoles();
        if (!roles || roles.length === 0) {
            throw ApiError.notFound('No hay roles registrados');
        }
        return roles;
    }

    // Obtener solo roles activos
    async getActiveRoles() {
        const roles = await roleModel.getActiveRoles();
        if (!roles || roles.length === 0) {
            throw ApiError.notFound('No hay roles activos registrados');
        }
        return roles;
    }

    // Obtener solo roles eliminados
    async getDeletedRoles() {
        const roles = await roleModel.getDeletedRoles();
        if (!roles || roles.length === 0) {
            throw ApiError.notFound('No hay roles eliminados registrados');
        }
        return roles;
    }

    // Obtener un rol por ID
    async getRoleById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del rol debe ser un número entero positivo');
        }

        const role = await roleModel.getRoleById(id);
        if (!role) {
            throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
        }
        return role;
    }

    // Obtener un rol por nombre
    async getRoleByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del rol es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const role = await roleModel.getRoleByName(nombreFormateado);

        if (!role) {
            throw ApiError.notFound(`Rol con nombre "${nombreFormateado}" no encontrado`);
        }
        return role;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo rol
    async addRole(data) {
        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre del rol es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un rol con ese nombre
        const existing = await roleModel.getRoleByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El rol con nombre "${nombre}" ya está registrado`);
        }

        return await roleModel.createRole({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un rol
    async modifyRole(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del rol debe ser un número entero positivo');
        }

        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre del rol es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el rol existe
        const existing = await roleModel.getRoleById(id);
        if (!existing) {
            throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro rol
        const nombreDuplicado = await roleModel.getRoleByName(nombre);
        if (nombreDuplicado && Number(nombreDuplicado.id) !== Number(id)) {
            throw ApiError.conflict(`El rol con nombre "${nombre}" ya está registrado por otro rol`);
        }

        return await roleModel.updateRole(id, { nombre, descripcion });
    }

    // ============================= MÉTODOS PATCH ==============================

    // Eliminado lógico
    async removeRole(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del rol debe ser un número entero positivo');
        }

        const existing = await roleModel.getRoleById(id);
        if (!existing) {
            throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
        }

        await roleModel.deleteRole(id);
    }

    // Restauración lógica
    async restoreRole(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del rol debe ser un número entero positivo');
        }

        const existing = await roleModel.getRoleById(id);
        if (!existing) {
            throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
        }

        await roleModel.restoreRole(id);
    }
}

// Exportar instancia del servicio
module.exports = new RoleService();
