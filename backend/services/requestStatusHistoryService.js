// services/requestStatusHistoryService.js

// Importar el modelo
const requestStatusHistoryModel = require('../models/requestStatusHistoryModel');

// Importar el modelo de request
const requestModel = require('../models/requestModel');

// Importar el validador el Zod
const { schemaIdValidator, schemaReqTrkCodeValidator, historyRequestCreatorValidator } = require('../utils/validators');

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
    async getStatusHistoriesByRequestCode(rawRequestCode) {

        // Validar codigo solicitud
        const { data, error } = schemaReqTrkCodeValidator('Solicitud').safeParse(rawRequestCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar codigo seguimiento
        const codigo_solicitud = data;

        const histories = await requestStatusHistoryModel.getStatusHistoriesByRequestCode(codigo_solicitud);
        if (!histories || histories.length === 0) throw ApiError.notFound(`No se encontró historial para la solicitud con código "${codigo_solicitud}"`);

        return histories;
    }

    // Obtener historial por código de sequimiento - detallado
    async getStatusHistoriesByTrackingCode(rawTrackingCode) {

        // Validar codigo seguiminto
        const { data, error } = schemaReqTrkCodeValidator('Seguimiento').safeParse(rawTrackingCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar codigo seguimiento
        const codigo_seguimiento = data;

        const histories = await requestStatusHistoryModel.getStatusHistoriesByTrackingCode(codigo_seguimiento);

        if (!histories || histories.length === 0) throw ApiError.notFound(`No se encontró historial para la solicitud con código de seguimiento "${codigo_seguimiento}"`);

        return histories;
    }

    // Obtener un registro del historial por ID
    async getStatusHistoryById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Historial').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const history = await requestStatusHistoryModel.getStatusHistoryById(id);
        if (!history || history.length === 0) throw ApiError.notFound(`Historial de estado con ID ${id} no encontrado`);

        return history;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo registro en historial de estados
    async addStatusHistory(rawData) {
        
        // Formateamos
        const formatData = {
            codigo_solicitud: rawData.codigo_solicitud,
            estado_solicitud_id: Number(rawData.estado_solicitud_id),
            area_actual_id: rawData.area_actual_id ? Number(rawData.area_actual_id) : null,
            area_destino_id: rawData.area_destino_id ? Number(rawData.area_destino_id) : null,
            notas: rawData.notas,
            usuario_id: rawData.usuario_id ? Number(rawData.usuario_id) : null,
        }

        // Validar data
        const { data, error } = historyRequestCreatorValidator.safeParse(formatData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recupearar datos
        const { codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id
        } = data;

        // Verificar si existe la solicitud
        const existingRequest = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequest || existingRequest.length === 0) throw ApiError.badRequest(`No existe una solicitud con ese codigo`);

        return await requestStatusHistoryModel.createStatusHistory({ codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id });
    }

}

// Exportar una instancia del servicio
module.exports = new RequestStatusHistoryService();
