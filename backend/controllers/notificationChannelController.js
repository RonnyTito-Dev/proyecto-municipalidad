// controllers/notificationChannelController.js

// Importamos el NotificationChannelService
const notificationChannelService = require('../services/notificationChannelService');

class NotificationChannelController {

    // ========================================== MÉTODOS GET ==========================================

    // Método para obtener todos los canales de notificación (sin importar estado)
    async getChannels(req, res, next) {
        try {
            const channels = await notificationChannelService.getChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo los canales activos
    async getActiveChannels(req, res, next) {
        try {
            const channels = await notificationChannelService.getActiveChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo los canales eliminados (lógicos)
    async getDeletedChannels(req, res, next) {
        try {
            const channels = await notificationChannelService.getDeletedChannels();
            res.json(channels);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un canal por ID
    async getChannelById(req, res, next) {
        const { id } = req.params;

        try {
            const channel = await notificationChannelService.getChannelById(id);
            res.json(channel);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un canal por nombre
    async getChannelByName(req, res, next) {
        const { nombre } = req.params;

        try {
            const channel = await notificationChannelService.getChannelByName(nombre);
            res.json(channel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Método para agregar un nuevo canal de notificación
    async createChannel(req, res, next) {
        const { nombre, descripcion } = req.body;

        try {
            const newChannel = await notificationChannelService.addChannel({ nombre, descripcion });
            res.status(201).json(newChannel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Método para actualizar un canal de notificación
    async updateChannel(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            const updatedChannel = await notificationChannelService.modifyChannel(id, { nombre, descripcion });
            res.json(updatedChannel);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO DELETE ==========================================

    // Método para eliminar (lógicamente) un canal de notificación
    async deleteChannel(req, res, next) {
        const { id } = req.params;

        try {
            await notificationChannelService.removeChannel(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new NotificationChannelController();
