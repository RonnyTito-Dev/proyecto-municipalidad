// notificationModel.js

// Importar la DB
const db = require('../config/db');

class NotificationModel {
    
    // ============================= MÉTODOS GET ==============================

    // Obtener todas las notificaciones
    async getAllNotifications() {
        const result = await db.query(
            `SELECT
                noti.id,
                noti.codigo_solicitud,
                cn.nombre AS canal,
                noti.mensaje,
                TO_CHAR(noti.fecha_envio, 'DD/MM/YYYY HH24:MI:SS') AS fecha_envio
            FROM notificaciones noti
            INNER JOIN canales_notificacion cn ON noti.canal_notificacion_id = cn.id
            ORDER BY noti.id DESC`
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

}

// Exportar una instancia del modelo
module.exports = new NotificationModel();
