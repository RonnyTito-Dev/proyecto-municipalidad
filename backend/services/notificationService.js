// services/notificationService.js

// Importar el modelo
const notificationModel = require('../models/notificationModel');

// Importar formatter
const formatter = require('../utils/textFormatter');

// Importar errores
const ApiError = require('../errors/apiError');

class NotificationService {

    // ========================== MÉTODOS GET ===========================

    // Obtener todas las notificaciones
    async getAllNotifications() {
        const notifications = await notificationModel.getAllNotifications();
        if (!notifications || notifications.length === 0) {
            throw ApiError.notFound('No hay notificaciones registradas');
        }
        return notifications;
    }

    // Obtener notificaciones por código de solicitud
    async getNotificationsByRequestCode(code) {
        const codigo = formatter.toUpperCase(code);
        if (!codigo) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }

        const notifications = await notificationModel.getNotificationsByRequestCode(codigo);
        if (!notifications || notifications.length === 0) {
            throw ApiError.notFound(`No hay notificaciones para el código "${codigo}"`);
        }

        return notifications;
    }

    // Obtener una notificación por ID
    async getNotificationById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID de la notificación debe ser un número entero positivo');
        }

        const notification = await notificationModel.getNotificationById(id);
        if (!notification) {
            throw ApiError.notFound(`Notificación con ID ${id} no encontrada`);
        }

        return notification;
    }

    // ========================== MÉTODO POST ===========================

    // Crear una nueva notificación
    async addNotification(data) {
        const codigo = formatter.toUpperCase(data.codigo_solicitud);
        const mensaje = formatter.trim(data.mensaje);

        if (!codigo) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }
        if (!data.canal_notificacion_id || isNaN(data.canal_notificacion_id)) {
            throw ApiError.badRequest('El ID del canal de notificación es requerido y debe ser un número');
        }
        if (!mensaje) {
            throw ApiError.badRequest('El mensaje de la notificación es requerido');
        }

        return await notificationModel.createNotification({
            codigo_solicitud: codigo,
            canal_notificacion_id: Number(data.canal_notificacion_id),
            mensaje,
        });
    }
}

// Exportar instancia del servicio
module.exports = new NotificationService();
