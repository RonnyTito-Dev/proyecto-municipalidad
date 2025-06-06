// controllers/notificationController.js

// Importamos el NotificationService
const notificationService = require('../services/notificationService');

class NotificationController {

    // ========================================== MÉTODOS GET ==========================================

    // Método para obtener todas las notificaciones (sin importar estado)
    async getAllNotifications(req, res, next) {
        try {
            const notifications = await notificationService.getAllNotifications();
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener notificaciones por código de solicitud
    async getNotificationsByRequestCode(req, res, next) {
        const { codigo_solicitud } = req.params;

        try {
            const notifications = await notificationService.getNotificationsByRequestCode(codigo_solicitud);
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener una notificación por ID
    async getNotificationById(req, res, next) {
        const { id } = req.params;

        try {
            const notification = await notificationService.getNotificationById(id);
            res.json(notification);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Método para crear una nueva notificación
    async createNotification(req, res, next) {
        const { codigo_solicitud, canal_notificacion_id, mensaje } = req.body;

        try {
            const newNotification = await notificationService.addNotification({
                codigo_solicitud,
                canal_notificacion_id,
                mensaje,
            });
            res.status(201).json(newNotification);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos la instancia de la clase
module.exports = new NotificationController();
