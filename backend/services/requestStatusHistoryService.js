// services/requestStatusHistoryService.js

// Importar el modelo
const requestStatusHistoryModel = require('../models/requestStatusHistoryModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class RequestStatusHistoryService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado
    async getStatusHistories() {
        const histories = await requestStatusHistoryModel.getAllStatusHistories();
        if (!histories || histories.length === 0) {
            throw ApiError.notFound('No hay historial de estados de solicitud registrado');
        }
        return histories;
    }

    // Obtener historial por código de solicitud - crudo
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

    // Obtener historial por código de sequimiento - detallado
    async getStatusHistoriesByTrackingCode(codigo_seguimiento) {
        if (!codigo_seguimiento) {
            throw ApiError.badRequest('El código de seguimiento es requerido');
        }

        const codigo = formatter.trim(codigo_seguimiento);
        const histories = await requestStatusHistoryModel.getStatusHistoriesByTrackingCode(codigo);

        if (!histories || histories.length === 0) {
            throw ApiError.notFound(`No se encontró historial para la solicitud con código de seguimiento "${codigo}"`);
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
            area_actual_id,
            area_destino_id,
            notas,
            usuario_id
        } = data;

        if (!codigo_solicitud) {
            throw ApiError.badRequest('El código de la solicitud es requerido');
        }
        if (!estado_solicitud_id || isNaN(estado_solicitud_id) || Number(estado_solicitud_id) <= 0 || !Number.isInteger(Number(estado_solicitud_id))) {
            throw ApiError.badRequest('El ID del estado de solicitud debe ser un número entero positivo');
        }

        const codigo = formatter.toUpperCase(codigo_solicitud);
        const estado_solicitud = estado_solicitud_id;
        const area_actual = area_actual_id ? area_actual_id : null;
        const area_destino = area_destino_id ? area_destino_id : null;
        const nota = formatter.trim(notas);
        const usuario = usuario_id ? usuario_id : null;

        return await requestStatusHistoryModel.createStatusHistory({
            codigo_solicitud: codigo,
            estado_solicitud_id: Number(estado_solicitud),
            area_actual_id: Number(area_actual),
            area_destino_id: Number(area_destino),
            notas: nota,
            usuario_id: Number(usuario),
        });
    }

}

// Exportar una instancia del servicio
module.exports = new RequestStatusHistoryService();
