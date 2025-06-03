// controllers/requestChannelController.js

// Importamos el service
const requestChannelService = require('../services/requestChannelService');

class RequestChannelController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todos los canales de solicitud
    async getRequestChannels(req, res, next) {
        try {
            const channels = await requestChannelService.getRequestChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo canales activos
    async getActiveRequestChannels(req, res, next) {
        try {
            const channels = await requestChannelService.getActiveRequestChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo canales eliminados
    async getDeletedRequestChannels(req, res, next) {
        try {
            const channels = await requestChannelService.getDeletedRequestChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un canal por ID
    async getRequestChannelById(req, res, next) {
        const { id } = req.params;
        try {
            const channel = await requestChannelService.getRequestChannelById(id);
            res.json(channel);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un canal por nombre
    async getRequestChannelByName(req, res, next) {
        const { nombre } = req.params;
        try {
            const channel = await requestChannelService.getRequestChannelByName(nombre);
            res.json(channel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear un nuevo canal
    async createRequestChannel(req, res, next) {
        const { nombre, descripcion } = req.body;
        try {
            const newChannel = await requestChannelService.addRequestChannel({ nombre, descripcion });
            res.status(201).json(newChannel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar un canal
    async updateRequestChannel(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            const updatedChannel = await requestChannelService.modifyRequestChannel(id, { nombre, descripcion });
            res.json(updatedChannel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PATCH ==========================================

    // Eliminación lógica de un canal de solicitud
    async deleteRequestChannel(req, res, next) {
        const { id } = req.params;
        try {
            await requestChannelService.removeRequestChannel(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    
    // Restauracion lógica de un canal de solicitud
    async restoreRequestChannel(req, res, next) {
        const { id } = req.params;
        try {
            await requestChannelService.restoreRequestChannel(id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos una instancia del controller
module.exports = new RequestChannelController();
