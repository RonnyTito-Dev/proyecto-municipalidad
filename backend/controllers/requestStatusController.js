// requestStatusController.js

// Importamos el RequestStatusService
const requestStatusService = require('../services/requestStatusService');

class RequestStatusController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todos los estados de solicitud (sin importar estado)
    async getRequestStatuses(req, res, next) {
        try {
            const statuses = await requestStatusService.getRequestStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo estados activos
    async getActiveRequestStatuses(req, res, next) {
        try {
            const statuses = await requestStatusService.getActiveRequestStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo estados inactivos
    async getInactiveRequestStatuses(req, res, next) {
        try {
            const statuses = await requestStatusService.getInactiveRequestStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado por ID
    async getRequestStatusById(req, res, next) {
        const { id } = req.params;

        try {
            const status = await requestStatusService.getRequestStatusById(id);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado por nombre
    async getRequestStatusByName(req, res, next) {
        const { nombre } = req.params;

        try {
            const status = await requestStatusService.getRequestStatusByName(nombre);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear un nuevo estado
    async createRequestStatus(req, res, next) {
        const { nombre, descripcion } = req.body;

        try {
            const newStatus = await requestStatusService.addRequestStatus({ nombre, descripcion });
            res.status(201).json(newStatus);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar un estado
    async updateRequestStatus(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            const updatedStatus = await requestStatusService.modifyRequestStatus(id, { nombre, descripcion });
            res.json(updatedStatus);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO DELETE ==========================================

    // Eliminación lógica de un estado
    async deleteRequestStatus(req, res, next) {
        const { id } = req.params;

        try {
            await requestStatusService.removeRequestStatus(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia del controller
module.exports = new RequestStatusController();
