// controllers/requestController.js

// Importamos el service
const requestService = require('../services/requestService');

class RequestController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todas las solicitudes (sin importar estado)
    async getAllRequests(req, res, next) {
        try {
            const requests = await requestService.getRequests();
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo solicitudes activas
    async getActiveRequests(req, res, next) {
        try {
            const requests = await requestService.getActiveRequests();
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo solicitudes eliminadas (lógicas)
    async getDeletedRequests(req, res, next) {
        try {
            const requests = await requestService.getDeletedRequests();
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solicitud por código de solicitud
    async getRequestByCodigoSolicitud(req, res, next) {
        const { codigo } = req.params;

        try {
            const request = await requestService.getRequestByCodigoSolicitud(codigo);
            res.json(request);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solicitud por código de seguimiento
    async getRequestByCodigoSeguimiento(req, res, next) {
        const { codigo } = req.params;

        try {
            const request = await requestService.getRequestByCodigoSeguimiento(codigo);
            res.json(request);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear una nueva solicitud
    async createRequest(req, res, next) {
        try {
            const newRequest = await requestService.addRequest(req.body);
            res.status(201).json(newRequest);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar solo el estado de una solicitud
    async updateRequestStatus(req, res, next) {
        const { codigo } = req.params;
        const { estado_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyRequestStatus(codigo, estado_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar solo el área actual de una solicitud
    async updateRequestArea(req, res, next) {
        const { codigo } = req.params;
        const { area_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyRequestArea(codigo, area_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar estado y área de una solicitud
    async updateRequestStatusAndArea(req, res, next) {
        const { codigo } = req.params;
        const { estado_id, area_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyStatusAndArea(codigo, estado_id, area_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO DELETE ==========================================

    // Eliminación lógica de una solicitud
    async deleteRequest(req, res, next) {
        const { codigo } = req.params;

        try {
            await requestService.removeRequest(codigo);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new RequestController();
