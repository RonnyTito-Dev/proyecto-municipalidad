// requestModel.js

// Importamos la base de datos
const db = require('../config/db');

class RequestModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las solicitudes ordenadas por id
    async getAllRequests() {
        const result = await db.query('SELECT * FROM solicitudes ORDER BY id');
        return result.rows;
    }


    // Obtener todas las solicitudes activas (estado_registro_id = 1)
    async getActiveRequests() {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }


    // Obtener solicitudes eliminadas
    async getDeletedRequests() {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE estado_registro_id = 2 ORDER BY id'
        );
        return result.rows;
    }



    // Obtener todas las solicitudes filtradas por estado de solicitud
    async getAllRequestsByStatus(estado_solicitud_id) {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE estado_solicitud_id = $1 ORDER BY id DESC',
            [estado_solicitud_id]
        );
        return result.rows;
    }

    // Obtener solicitud por ID
    async getRequestById(id) {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener solicitud por código de solicitud
    async getRequestByCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE codigo_solicitud = $1',
            [codigo_solicitud]
        );
        return result.rows[0];
    }

    // Obtener solicitud por código de seguimiento
    async getRequestByTrackingCode(codigo_seguimiento) {
        const result = await db.query(
            'SELECT * FROM solicitudes WHERE codigo_seguimiento = $1',
            [codigo_seguimiento]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear una nueva solicitud con todos los datos requeridos
    async createRequest({ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
        sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto,
        solicitud, pin, canal_notificacion_id, canal_solicitud_id, usuario_id
    }) {
        const result = await db.query(
            `INSERT INTO solicitudes (
                codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
                sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto,
                solicitud, pin, canal_notificacion_id, canal_solicitud_id, usuario_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
                sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto,
                solicitud, pin, canal_notificacion_id, canal_solicitud_id, usuario_id
            ]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar datos completos de una solicitud por código de solicitud (no se usa)
    async updateRequest(codigo_solicitud, { nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
                                            sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto,
                                            solicitud, pin, fecha_ingreso, canal_notificacion_id ,canal_solicitud_id,
                                            estado_solicitud_id, area_actual_id, usuario_id, estado_registro_id
    }) {
        const result = await db.query(
            `UPDATE solicitudes SET nombres_ciudadano = $1, apellidos_ciudadano = $2, dni_ciudadano = $3, direccion_ciudadano = $4,
                                sector_ciudadano = $5, email_ciudadano = $6, celular_ciudadano = $7, codigo_seguimiento = $8, asunto = $9,
                                solicitud = $10, pin = $11, fecha_ingreso = $12, canal_notificacion_id = $13, canal_solicitud_id = $14,
                                estado_solicitud_id = $15, area_actual_id = $16, usuario_id = $17, estado_registro_id = $18
             WHERE codigo_solicitud = $19 RETURNING *`,

            [ nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
                sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto,
                solicitud, pin, fecha_ingreso, canal_notificacion_id, canal_solicitud_id,
                estado_solicitud_id, area_actual_id, usuario_id, estado_registro_id, 
                codigo_solicitud
            ]
        );
        return result.rows[0];
    }

    // Actualizar estado de solicitud por código de solicitud
    async updateStatusRequest(codigo_solicitud, estado_solicitud_id) {
        const result = await db.query(
            `UPDATE solicitudes
             SET estado_solicitud_id = $1
             WHERE codigo_solicitud = $2
             RETURNING *`,
            [estado_solicitud_id, codigo_solicitud]
        );
        return result.rows[0];
    }

    // Actualizar área actual de la solicitud por código de solicitud
    async updateAreaRequest(codigo_solicitud, area_actual_id) {
        const result = await db.query(
            `UPDATE solicitudes
             SET area_actual_id = $1
             WHERE codigo_solicitud = $2
             RETURNING *`,
            [area_actual_id, codigo_solicitud]
        );
        return result.rows[0];
    }

    // Actualizar estado de solicitud y área actual por código de solicitud
    async updateStatusAndArea(codigo_solicitud, estado_solicitud_id, area_actual_id) {
        const result = await db.query(
            `UPDATE solicitudes
             SET estado_solicitud_id = $1,
                 area_actual_id = $2
             WHERE codigo_solicitud = $3
             RETURNING *`,
            [estado_solicitud_id, area_actual_id, codigo_solicitud]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminación lógica: actualizar estado_registro_id a 2 (solicitud eliminada)
    async deleteRequest(codigo_solicitud) {
        await db.query(
            `UPDATE solicitudes
             SET estado_registro_id = 2
             WHERE codigo_solicitud = $1`,
            [codigo_solicitud]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new RequestModel();
