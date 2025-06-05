// services/userStatusService.js

// Importar el modelo
const userStatusModel = require('../models/userStatusModel');

// Importar el validador de zod
const { schemaIdValidator, schemaNameValidator, simpleCreateValidator, simpleUpdatedValidator } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class UserStatusService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados
    async getAllStatuses() {
        const statuses = await userStatusModel.getAllStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay Estados de Usuario registrados');
        }
        return statuses;
    }

    // Obtener solo estados activos
    async getActiveStatuses() {
        const statuses = await userStatusModel.getActiveStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay Estados de Usuario activos registrados');
        }
        return statuses;
    }

    // Obtener solo estados eliminados
    async getDeletedStatuses() {
        const statuses = await userStatusModel.getDeletedStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay Estados de Usuario eliminados registrados');
        }
        return statuses;
    }

    // Obtener un estado por ID
    async getStatusById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Estado de Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const status = await userStatusModel.getStatusById(id);
        if (!status) throw ApiError.notFound(`Estado de Usuario con ID ${id} no encontrado`);

        return status;
    }

    // Obtener un estado por nombre
    async getStatusByName(rawName) {

        // Validar el nombre
        const { data, error } = schemaNameValidator('Estado Usuario').safeParse(rawName);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el nombre
        const nombre = data;
        const status = await userStatusModel.getStatusByName(nombre);

        if (!status) throw ApiError.notFound(`Estado de Usuario con nombre "${nombre}" no encontrado`);

        return status;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo estado de usuario
    async addStatus(rawData) {

        // Validar datos
        const { data, error } = simpleCreateValidator('Estado Usuario').safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { nombre, descripcion } = data;

        // Verificar si ya existe un estado con ese nombre
        const existing = await userStatusModel.getStatusByName(nombre);
        if (existing) throw ApiError.conflict(`El Estado de Usuario con nombre "${nombre}" ya está registrado`);

        return await userStatusModel.createStatus({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un estado de usuario
    async modifyStatus(rawId, rawData) {

        // Validar datos
        const { data, error } = simpleUpdatedValidator('Estado de Usuario').safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { id, nombre, descripcion } = data;

        // Verificar si el estado existe
        const existing = await userStatusModel.getStatusById(id);
        if (!existing) throw ApiError.notFound(`Estado de Usuario con ID ${id} no encontrado`);

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro estado
        const nombreDuplicado = await userStatusModel.getStatusByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) throw ApiError.conflict(`El Estado de Usuario con nombre "${nombre}" ya está registrado por otro estado`);

        return await userStatusModel.updateStatus(id, { nombre, descripcion });
    }

    // ============================ MÉTODOS PATCH ==============================

    // Eliminación lógica
    async removeStatus(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Estado de Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const existing = await userStatusModel.getStatusById(id);
        if (!existing) throw ApiError.notFound(`Estado de Usuario con ID ${id} no encontrado`);

        await userStatusModel.deleteStatus(id);
    }

    // Restauracion lógica
    async restoreStatus(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Estado de Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const existing = await userStatusModel.getStatusById(id);
        if (!existing) throw ApiError.notFound(`Estado de Usuario con ID ${id} no encontrado`);

        await userStatusModel.restoreStatus(id);
    }
}

// Exportar una instancia del servicio
module.exports = new UserStatusService();
