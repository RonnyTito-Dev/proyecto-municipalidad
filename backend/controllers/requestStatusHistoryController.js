// requestStatusHistoryController.js

// Importamos el service
const requestStatusHistoryService = require('../services/requestStatusHistoryService');

class RequestStatusHistoryController {

    // ============================== MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado (sin filtro)
    async getStatusHistories(req, res, next) {
        try {
            const histories = await requestStatusHistoryService.getStatusHistories();
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo historial activo
    async getActiveStatusHistories(req, res, next) {
        try {
            const histories = await requestStatusHistoryService.getActiveStatusHistories();
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo historial eliminado
    async getDeletedStatusHistories(req, res, next) {
        try {
            const histories = await requestStatusHistoryService.getDeletedStatusHistories();
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener historial por código de solicitud
    async getStatusHistoriesByRequestCode(req, res, next) {
        const { codigo_solicitud } = req.params;

        try {
            const histories = await requestStatusHistoryService.getStatusHistoriesByRequestCode(codigo_solicitud);
            res.json(histories);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un registro del historial por ID
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
        const {
            codigo_solicitud,
            estado_solicitud_id,
            area_id,
            observaciones,
            usuario_id
        } = req.body;

        try {
            const newHistory = await requestStatusHistoryService.addStatusHistory({
                codigo_solicitud,
                estado_solicitud_id,
                area_id,
                observaciones,
                usuario_id
            });
            res.status(201).json(newHistory);
        } catch (error) {
            next(error);
        }
    }

    // ============================== MÉTODO PUT ==============================

    // Actualizar un registro del historial por ID
    async updateStatusHistory(req, res, next) {
        const { id } = req.params;
        const {
            codigo_solicitud,
            estado_solicitud_id,
            area_id,
            observaciones,
            usuario_id
        } = req.body;

        try {
            const updatedHistory = await requestStatusHistoryService.modifyStatusHistory(id, {
                codigo_solicitud,
                estado_solicitud_id,
                area_id,
                observaciones,
                usuario_id
            });
            res.json(updatedHistory);
        } catch (error) {
            next(error);
        }
    }

    // ============================== MÉTODO DELETE ==============================

    // Eliminación lógica de un registro del historial
    async deleteStatusHistory(req, res, next) {
        const { id } = req.params;

        try {
            await requestStatusHistoryService.removeStatusHistory(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos una instancia del controller
module.exports = new RequestStatusHistoryController();
