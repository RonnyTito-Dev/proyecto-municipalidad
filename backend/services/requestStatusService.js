// services/requestStatusService.js

// Importar el modelo
const requestStatusModel = require('../models/requestStatusModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class RequestStatusService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados de solicitud (sin importar estado)
    async getRequestStatuses() {
        const statuses = await requestStatusModel.getAllRequestStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados de solicitud registrados');
        }
        return statuses;
    }

    // Obtener solo estados activos (estado_registro_id = 1)
    async getActiveRequestStatuses() {
        const statuses = await requestStatusModel.getActiveRequestStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados de solicitud activos registrados');
        }
        return statuses;
    }

    // Obtener solo estados inactivos (estado_registro_id = 2)
    async getInactiveRequestStatuses() {
        const statuses = await requestStatusModel.getInactiveRequestStatuses();
        if (!statuses || statuses.length === 0) {
            throw ApiError.notFound('No hay estados de solicitud inactivos registrados');
        }
        return statuses;
    }

    // Obtener un estado por ID
    async getRequestStatusById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }

        const status = await requestStatusModel.getRequestStatusById(id);
        if (!status) {
            throw ApiError.notFound(`Estado de solicitud con ID ${id} no encontrado`);
        }
        return status;
    }

    // Obtener un estado por nombre
    async getRequestStatusByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del estado de solicitud es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const status = await requestStatusModel.getRequestStatusByName(nombreFormateado);

        if (!status) {
            throw ApiError.notFound(`Estado de solicitud con nombre "${nombreFormateado}" no encontrado`);
        }
        return status;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo estado
    async addRequestStatus(data) {
        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado de solicitud es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un estado con ese nombre
        const existing = await requestStatusModel.getRequestStatusByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El estado de solicitud con nombre "${nombre}" ya está registrado`);
        }

        return await requestStatusModel.createRequestStatus({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un estado
    async modifyRequestStatus(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }

        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado de solicitud es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el estado existe
        const existing = await requestStatusModel.getRequestStatusById(id);
        if (!existing) {
            throw ApiError.notFound(`Estado de solicitud con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro estado
        const nombreDuplicado = await requestStatusModel.getRequestStatusByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) {
            throw ApiError.conflict(`El estado de solicitud con nombre "${nombre}" ya está registrado por otro estado`);
        }

        return await requestStatusModel.updateRequestStatus(id, { nombre, descripcion });
    }

    // ============================= MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2 (inactivo)
    async removeRequestStatus(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }

        const existing = await requestStatusModel.getRequestStatusById(id);
        if (!existing) {
            throw ApiError.notFound(`Estado de solicitud con ID ${id} no encontrado`);
        }

        await requestStatusModel.deleteRequestStatus(id);
    }
}

// Exportar una instancia del servicio
module.exports = new RequestStatusService();
