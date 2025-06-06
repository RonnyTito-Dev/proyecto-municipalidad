// controllers/requestController.js

// Importamos el service
const requestService = require('../services/requestService');
const requestHandlerService = require('../utils/requestHandlerService');

// Importamos el manejador de solicitudes
const RequestHandlerService = require('../utils/requestHandlerService');

class RequestController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todas las solicitudes
    async getAllRequests(req, res, next) {
        try {

            // Obtenemos el area
            const { area_id } = req.user;

            // Almacenar la respuesta
            let requests;

            // Si es super admin o admin
            if (area_id === 1 || area_id === 2) {

                // Si trae estado de solicitud
                requests = await requestService.getRequests();

            } else {
                // Si solo es una area sin privilegios
                requests = await requestService.getAllRequestsByArea(area_id);
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
            const request = await requestService.getRequestByTrackingCodeAndPin({ codigo_seguimiento, pin_seguridad });
            res.json(request);
        } catch (error) {
            next(error);
        }
    }


    // ========================================== MÉTODO POST ==========================================

    // Crear una nueva solicitud
    async createRequest(req, res, next) {
        
        try {

            const data = { 
                ...req.body, 
                usuario_id: req.user?.usuario_id ?? null
            };

            const newRequest = await requestService.addRequest(data);

            // const newRequest = await requestHandlerService.creatingRequest(data);

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
            const updatedRequest = await requestService.modifyRequestStatus({ codigo_solicitud, estado_solicitud_id });
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
            const updatedRequest = await requestService.modifyRequestAsignArea({ codigo_solicitud, area_asignada_id });
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
            const updatedRequest = await requestService.modifyStatusAndAreaAsign({ codigo_solicitud, estado_solicitud_id, area_asignada_id });
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO OTROS PUT ==========================================

    // Recepcionar solicitud
    async receiveRequest(req, res, next) {
        const { codigo_solicitud } = req.params;
        const { estado_solicitud_id, area_asignada_id } = req.body;

        try {
            const updatedRequest = await requestService.modifyStatusAndAreaAsign({ codigo_solicitud, estado_solicitud_id, area_asignada_id });
            res.json(updatedRequest);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos la instancia de la clase
module.exports = new RequestController();
