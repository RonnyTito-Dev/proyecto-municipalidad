// services/userStatusService.js

// Importar el modelo
const userStatusModel = require('../models/userStatusModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class UserStatusService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados
    async getAllStatuses() {
        const statuses = await userStatusModel.getAllStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados de usuario registrados');
        }
        return statuses;
    }

    // Obtener solo estados activos (estado_registro_id = 1)
    async getActiveStatuses() {
        const statuses = await userStatusModel.getActiveStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados activos registrados');
        }
        return statuses;
    }

    // Obtener solo estados eliminados (estado_registro_id = 2)
    async getDeletedStatuses() {
        const statuses = await userStatusModel.getDeletedStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados eliminados registrados');
        }
        return statuses;
    }

    // Obtener un estado por ID
    async getStatusById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado debe ser un número entero positivo');
        }

        const status = await userStatusModel.getStatusById(id);
        if (!status) {
            throw ApiError.notFound(`Estado con ID ${id} no encontrado`);
        }
        return status;
    }

    // Obtener un estado por nombre
    async getStatusByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del estado es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const status = await userStatusModel.getStatusByName(nombreFormateado);

        if (!status) {
            throw ApiError.notFound(`Estado con nombre "${nombreFormateado}" no encontrado`);
        }
        return status;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo estado de usuario
    async addStatus(data) {
        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un estado con ese nombre
        const existing = await userStatusModel.getStatusByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El estado con nombre "${nombre}" ya está registrado`);
        }

        return await userStatusModel.createStatus({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un estado de usuario
    async modifyStatus(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado debe ser un número entero positivo');
        }

        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el estado existe
        const existing = await userStatusModel.getStatusById(id);
        if (!existing) {
            throw ApiError.notFound(`Estado con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro estado
        const nombreDuplicado = await userStatusModel.getStatusByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) {
            throw ApiError.conflict(`El estado con nombre "${nombre}" ya está registrado por otro estado`);
        }

        return await userStatusModel.updateStatus(id, { nombre, descripcion });
    }

    // ============================ MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2
    async removeStatus(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado debe ser un número entero positivo');
        }

        const existing = await userStatusModel.getStatusById(id);
        if (!existing) {
            throw ApiError.notFound(`Estado con ID ${id} no encontrado`);
        }

        await userStatusModel.deleteStatus(id);
    }
}

// Exportar una instancia del servicio
module.exports = new UserStatusService();
