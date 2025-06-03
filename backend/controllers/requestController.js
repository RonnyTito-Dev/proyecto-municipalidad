// controllers/requestController.js

// Importamos el service
const requestService = require('../services/requestService');

class RequestController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todas las solicitudes - solo areas 1 y 2
    async getAllRequests(req, res, next) {
        try {
            const area_id = req.user.area_usuario_id;
            const estado_solicitud_id = req.query.estado_solicitud_id
                ? parseInt(req.query.estado_solicitud_id) : null;

            let requests;

            // Si es super admin o admin
            if (area_id === 1 || area_id === 2) {

                // Si trae estado de solicitud
                if (estado_solicitud_id) {
                    requests = await requestService.getAllRequestsByStatus(estado_solicitud_id);
                }
                else {
                    requests = await requestService.getRequests();
                }

            } else {

                // Si solo es una area sin privilegios
                if (estado_solicitud_id) {
                    requests = await requestService.getAllRequestsByAreaAndStatus(area_id, estado_solicitud_id);
                }
                else {
                    requests = await requestService.getAllRequestsByArea(area_id);
                }
            }
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }



    // Obtener solicitud por código de solicitud
    async getRequestByRequestCode(req, res, next) {
        const { codigo_solicitud } = req.params;

        try {
            const request = await requestService.getRequestByRequestCode(codigo_solicitud);
            res.json(request);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solicitud por código de seguimiento - detallado
    async getRequestByTrackingCode(req, res, next) {
        const { codigo_seguimiento } = req.params;

        try {
            const request = await requestService.getRequestByTrackingCode(codigo_seguimiento);
            res.json(request);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solicitud por código de seguimiento y PIN (ciudadano sin login)
    async getRequestByTrackingCodeAndPin(req, res, next) {
        const { codigo_seguimiento, pin_seguridad } = req.body;

        try {
            const request = await requestService.getRequestByTrackingCodeAndPin(codigo_seguimiento, pin_seguridad);
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
        const { codigo_solicitud } = req.params;
        const { estado_solicitud_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyRequestStatus(codigo_solicitud, estado_solicitud_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar la asignacion de un area
    async updateRequestAsignArea(req, res, next) {
        const { codigo_solicitud } = req.params;
        const { area_asignada_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyRequestAsignArea(codigo_solicitud, area_asignada_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // Actualizar asignar de un area y cambiar su estado de solicitud
    async updateRequestStatusAndAsignArea(req, res, next) {
        const { codigo_solicitud } = req.params;
        const { estado_solicitud_id, area_asignada_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyStatusAndAreaAsign(codigo_solicitud, estado_solicitud_id, area_asignada_id);
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }


}

// Exportamos la instancia de la clase
module.exports = new RequestController();
