// services/requestStatusHistoryService.js

// Importar el modelo
const requestStatusHistoryModel = require('../models/requestStatusHistoryModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class RequestStatusHistoryService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado (sin filtro)
    async getStatusHistories() {
        const histories = await requestStatusHistoryModel.getAllStatusHistories();
        if (!histories || histories.length === 0) {
            throw ApiError.notFound('No hay historial de estados de solicitud registrado');
        }
        return histories;
    }

    // Obtener solo historial activo (estado_registro_id = 1)
    async getActiveStatusHistories() {
        const histories = await requestStatusHistoryModel.getActiveStatusHistories();
        if (!histories || histories.length === 0) {
            throw ApiError.notFound('No hay historial de estados de solicitud activos registrados');
        }
        return histories;
    }

    // Obtener solo historial eliminado (estado_registro_id = 2)
    async getDeletedStatusHistories() {
        const histories = await requestStatusHistoryModel.getDeletedStatusHistories();
        if (!histories || histories.length === 0) {
            throw ApiError.notFound('No hay historial de estados de solicitud eliminados registrados');
        }
        return histories;
    }

    // Obtener historial por código de solicitud
    async getStatusHistoriesByRequestCode(codigo_solicitud) {
        if (!codigo_solicitud) {
            throw ApiError.badRequest('El código de la solicitud es requerido');
        }

        const codigo = formatter.trim(codigo_solicitud);
        const histories = await requestStatusHistoryModel.getStatusHistoriesByRequestCode(codigo);

        if (!histories || histories.length === 0) {
            throw ApiError.notFound(`No se encontró historial para la solicitud con código "${codigo}"`);
        }
        return histories;
    }

    // Obtener un registro del historial por ID
    async getStatusHistoryById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del historial debe ser un número entero positivo');
        }

        const history = await requestStatusHistoryModel.getStatusHistoryById(id);
        if (!history) {
            throw ApiError.notFound(`Historial de estado con ID ${id} no encontrado`);
        }
        return history;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo registro en historial de estados
    async addStatusHistory(data) {
        const {
            codigo_solicitud,
            estado_solicitud_id,
            area_id,
            observaciones,
            usuario_id
        } = data;

        if (!codigo_solicitud) {
            throw ApiError.badRequest('El código de la solicitud es requerido');
        }
        if (!estado_solicitud_id || isNaN(estado_solicitud_id) || Number(estado_solicitud_id) <= 0 || !Number.isInteger(Number(estado_solicitud_id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }
        if (!area_id || isNaN(area_id) || Number(area_id) <= 0 || !Number.isInteger(Number(area_id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const codigo = formatter.toUpperCase(codigo_solicitud);
        const observ = formatter.trim(observaciones);

        return await requestStatusHistoryModel.createStatusHistory({
            codigo_solicitud: codigo,
            estado_solicitud_id: Number(estado_solicitud_id),
            area_id: Number(area_id),
            observaciones: observ,
            usuario_id: Number(usuario_id),
        });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un registro del historial por ID
    async modifyStatusHistory(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del historial debe ser un número entero positivo');
        }

        const {
            codigo_solicitud,
            estado_solicitud_id,
            area_id,
            observaciones,
            usuario_id
        } = data;

        if (!codigo_solicitud) {
            throw ApiError.badRequest('El código de la solicitud es requerido');
        }
        if (!estado_solicitud_id || isNaN(estado_solicitud_id) || Number(estado_solicitud_id) <= 0 || !Number.isInteger(Number(estado_solicitud_id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }
        if (!area_id || isNaN(area_id) || Number(area_id) <= 0 || !Number.isInteger(Number(area_id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const existing = await requestStatusHistoryModel.getStatusHistoryById(id);
        if (!existing) {
            throw ApiError.notFound(`Historial de estado con ID ${id} no encontrado`);
        }

        const codigo = formatter.toUpperCase(codigo_solicitud);
        const observ = formatter.trim(observaciones);

        // Validar si no hay cambios
        if (
            codigo === existing.codigo_solicitud &&
            Number(estado_solicitud_id) === existing.estado_solicitud_id &&
            Number(area_id) === existing.area_id &&
            observ === existing.observaciones &&
            Number(usuario_id) === existing.usuario_id
        ) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        return await requestStatusHistoryModel.updateStatusHistory(id, {
            codigo_solicitud: codigo,
            estado_solicitud_id: Number(estado_solicitud_id),
            area_id: Number(area_id),
            observaciones: observ,
            usuario_id: Number(usuario_id),
        });
    }

    // ============================= MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2 (eliminado)
    async removeStatusHistory(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del historial debe ser un número entero positivo');
        }

        const existing = await requestStatusHistoryModel.getStatusHistoryById(id);
        if (!existing) {
            throw ApiError.notFound(`Historial de estado con ID ${id} no encontrado`);
        }

        await requestStatusHistoryModel.deleteStatusHistory(id);
    }
}

// Exportar una instancia del servicio
module.exports = new RequestStatusHistoryService();
