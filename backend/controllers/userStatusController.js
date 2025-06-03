// controllers/userStatusController.js

// Importamos el UserStatusService
const userStatusService = require('../services/userStatusService');

class UserStatusController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todos los estados de usuario
    async getStatuses(req, res, next) {
        try {
            const statuses = await userStatusService.getAllStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo estados activos
    async getActiveStatuses(req, res, next) {
        try {
            const statuses = await userStatusService.getActiveStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo estados eliminados
    async getDeletedStatuses(req, res, next) {
        try {
            const statuses = await userStatusService.getDeletedStatuses();
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado por ID
    async getStatusById(req, res, next) {
        const { id } = req.params;
        try {
            const status = await userStatusService.getStatusById(id);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado por nombre
    async getStatusByName(req, res, next) {
        const { nombre } = req.params;
        try {
            const status = await userStatusService.getStatusByName(nombre);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear un nuevo estado de usuario
    async createStatus(req, res, next) {
        try {
            const newStatus = await userStatusService.addStatus(req.body);
            res.status(201).json(newStatus);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar un estado de usuario
    async updateStatus(req, res, next) {
        const { id } = req.params;
        try {
            const updatedStatus = await userStatusService.modifyStatus(id, req.body);
            res.json(updatedStatus);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PATCH ==========================================

    // Eliminar un estado (eliminación lógica)
    async deleteStatus(req, res, next) {
        const { id } = req.params;
        try {
            await userStatusService.removeStatus(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }

    // Restaurar un estado (eliminación lógica)
    async restoreStatus(req, res, next) {
        const { id } = req.params;
        try {
            await userStatusService.restoreStatus(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new UserStatusController();