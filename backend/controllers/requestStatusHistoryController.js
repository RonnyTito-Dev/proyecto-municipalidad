// requestStatusHistoryController.js

// Importamos el service
const requestStatusHistoryService = require('../services/requestStatusHistoryService');

class RequestStatusHistoryController {

    // ============================== MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado
    async getStatusHistories(req, res, next) {
        try {
            const histories = await requestStatusHistoryService.getStatusHistories();
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener historial por código de solicitud - crudo
    async getStatusHistoriesByRequestCode(req, res, next) {
        const { codigo_solicitud } = req.params;

        try {
            const histories = await requestStatusHistoryService.getStatusHistoriesByRequestCode(codigo_solicitud);
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener historial por código de seguimiento - detallado
    async getStatusHistoriesByTrackingCode(req, res, next) {
        const { codigo_seguimiento } = req.params;

        try {
            const histories = await requestStatusHistoryService.getStatusHistoriesByTrackingCode(codigo_seguimiento);
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un registro del historial por ID - crudo
    async getStatusHistoryById(req, res, next) {
        const { id } = req.params;

        try {
            const history = await requestStatusHistoryService.getStatusHistoryById(id);
            res.json(history);
        } catch (error) {
            next(error);
        }
    }

    // ============================== MÉTODO POST ==============================

    // Crear un nuevo registro en historial de estados
    async createStatusHistory(req, res, next) {
        
        try {

            const { codigo_solicitud } = req.params;
            const { estado_solicitud_id, area_destino_id, notas } = req.body;
            const { usuario_id, area_id } = req.user;

            const newHistory = await requestStatusHistoryService.addStatusHistory({
                codigo_solicitud,
                estado_solicitud_id,
                area_actual_id: area_id,
                area_destino_id,
                notas,
                usuario_id
            });

            res.status(201).json(newHistory);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos una instancia del controller
module.exports = new RequestStatusHistoryController();
