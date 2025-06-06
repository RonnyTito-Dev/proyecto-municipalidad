// services/notificationService.js

// Importar el modelo
const notificationModel = require('../models/notificationModel');

// Importar el modelo de request
const requestModel = require('../models/requestModel');

// Importar el validador de Zod
const { schemaIdValidator, schemaReqTrkCodeValidator, notificationCreatorValidator } = require('../utils/validators');

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
    async getNotificationsByRequestCode(rawRequestCode) {

        // Validar codigo solicitud
        const { data, error } = schemaReqTrkCodeValidator('Solicitud').safeParse(rawRequestCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar codigo seguimiento
        const codigo_solicitud = data;

        const notifications = await notificationModel.getNotificationsByRequestCode(codigo_solicitud);
        if (!notifications || notifications.length === 0) throw ApiError.notFound(`No hay notificaciones para el código "${codigo_solicitud}"`);

        return notifications;
    }

    // Obtener una notificación por ID
    async getNotificationById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Notificacion').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const notification = await notificationModel.getNotificationById(id);
        if (!notification) throw ApiError.notFound(`Notificación con ID ${id} no encontrada`);
        
        return notification;
    }

    // ========================== MÉTODO POST ===========================

    // Crear una nueva notificación
    async addNotification(rawData) {

        // Formatear la data
        const formatData = {
            codigo_solicitud: rawData.codigo_solicitud,
            canal_notificacion_id: Number(rawData.canal_notificacion_id),
            mensaje: rawData.mensaje
        }

        // Validar la data
        const { data, error } = notificationCreatorValidator.safeParse(formatData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { codigo_solicitud, canal_notificacion_id, mensaje } = data;

        // Verificar si existe la solicitud
        const existingRequest = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequest || existingRequest.length === 0) throw ApiError.badRequest(`No existe una solicitud con ese codigo`);


        return await notificationModel.createNotification({ codigo_solicitud, canal_notificacion_id, mensaje });
    }
}

// Exportar instancia del servicio
module.exports = new NotificationService();
