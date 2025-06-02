// notificationModel.js

// Importar la DB
const db = require('../config/db');

class NotificationModel {
    
    // ============================= MÉTODOS GET ==============================

    // Obtener todas las notificaciones
    async getAllNotifications() {
        const result = await db.query('SELECT * FROM notificaciones ORDER BY fecha_envio DESC');
        return result.rows;
    }

    // Obtener notificaciones activas (estado_registro_id = 1)
    async getActiveNotifications() {
        const result = await db.query(
            'SELECT * FROM notificaciones WHERE estado_registro_id = 1 ORDER BY fecha_envio DESC'
        );
        return result.rows;
    }

    // Obtener notificaciones eliminadas (estado_registro_id = 2)
    async getDeletedNotifications() {
        const result = await db.query(
            'SELECT * FROM notificaciones WHERE estado_registro_id = 2 ORDER BY fecha_envio DESC'
        );
        return result.rows;
    }

    // Obtener notificaciones por código de solicitud
    async getNotificationsByRequestCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM notificaciones WHERE codigo_solicitud = $1 ORDER BY fecha_envio DESC',
            [codigo_solicitud]
        );
        return result.rows;
    }

    // Obtener una notificación por ID
    async getNotificationById(id) {
        const result = await db.query(
            'SELECT * FROM notificaciones WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear una nueva notificación
    async createNotification({ codigo_solicitud, canal_notificacion_id, mensaje }) {
        const result = await db.query(
            `INSERT INTO notificaciones (
                codigo_solicitud,
                canal_notificacion_id,
                mensaje
            ) VALUES ($1, $2, $3)
            RETURNING *`,
            [codigo_solicitud, canal_notificacion_id, mensaje]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar una notificación por ID
    async updateNotification(id, { codigo_solicitud, canal_notificacion_id, mensaje }) {
        const result = await db.query(
            `UPDATE notificaciones
             SET codigo_solicitud = $1,
                 canal_notificacion_id = $2,
                 mensaje = $3
             WHERE id = $4
             RETURNING *`,
            [codigo_solicitud, canal_notificacion_id, mensaje, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminación lógica: actualizar estado_registro_id a 2
    async deleteNotification(id) {
        await db.query(
            `UPDATE notificaciones
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new NotificationModel();
