// requestModel.js

// Importamos la base de datos
const db = require('../config/db');

class RequestModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las solicitudes solo para super usuarios
    async getAllRequests() {
        const result = await db.query(
            `SELECT
                so.id,
                so.codigo_solicitud,
                so.nombres_ciudadano,
                so.apellidos_ciudadano,
                ar.id AS area_asignada_id,
                ar.nombre AS area_asignada,
                so.asunto,
                TO_CHAR(so.fecha_envio, 'DD/MM/YYYY') AS fecha_envio,
                es.id AS estado_solicitud_id,
                es.nombre AS estado_solicitud
            FROM solicitudes so
            INNER JOIN estados_solicitud es ON so.estado_solicitud_id = es.id
            LEFT JOIN areas ar ON so.area_asignada_id = ar.id
            ORDER BY so.id DESC`
        );
        return result.rows;
    }


    // Obtener solicitudes todas las solicitudes filtrado por area 
    async getAllRequestsByArea(area_id){
        const result = await db.query(
            `SELECT
                so.id,
                so.codigo_solicitud,
                so.nombres_ciudadano,
                so.apellidos_ciudadano,
                ar.id AS area_asignada_id,
                ar.nombre AS area_asignada,
                so.asunto,
                TO_CHAR(so.fecha_envio, 'DD/MM/YYYY') AS fecha_envio,
                es.id AS estado_solicitud_id,
                es.nombre AS estado_solicitud
            FROM solicitudes so
            INNER JOIN estados_solicitud es ON so.estado_solicitud_id = es.id
            LEFT JOIN areas ar ON so.area_asignada_id = ar.id
            WHERE so.area_asignada_id = $1
            ORDER BY so.id DESC`,
            [area_id]
        );
        return result.rows;
    }


    // Obtener solicitud por código de solicitud - detallado
    async getRequestByCode(codigo_solicitud) {
        const result = await db.query(
            `SELECT
                so.id,
                so.codigo_solicitud,
                so.nombres_ciudadano,
                so.apellidos_ciudadano,
                so.dni_ciudadano,
                so.direccion_ciudadano,
                so.sector_ciudadano,
                so.email_ciudadano,
                so.celular_ciudadano,
                so.codigo_seguimiento,
                ars.nombre AS area_sugerida,
                ara.nombre AS area_asignada,
                so.asunto,
                so.contenido,
                TO_CHAR(so.fecha_envio, 'DD/MM/YYYY HH24:MI:SS') AS fecha_envio,
                cn.nombre AS canal_notificacion,
                cs.nombre AS canal_solicitud,
                es.nombre AS estado_solicitud,
                us.nombres || us.apellidos AS usuario_tramite
            FROM solicitudes so
            INNER JOIN areas ars ON so.area_sugerida_id = ars.id
            LEFT JOIN areas ara ON so.area_asignada_id = ara.id
            INNER JOIN canales_notificacion cn ON so.canal_notificacion_id = cn.id
            INNER JOIN canales_solicitud cs ON so.canal_solicitud_id =  cs.id
            INNER JOIN estados_solicitud es ON so.estado_solicitud_id = es.id
            LEFT JOIN usuarios us ON so.usuario_id = us.id
            WHERE so.codigo_solicitud = $1`,
            [codigo_solicitud]
        );
        return result.rows[0];
    }

    // Obtener solicitud por código de seguimiento - detallado
    async getRequestByTrackingCode(codigo_seguimiento) {
        const result = await db.query(
            `SELECT
                so.id,
                so.codigo_solicitud,
                so.nombres_ciudadano,
                so.apellidos_ciudadano,
                so.dni_ciudadano,
                so.direccion_ciudadano,
                so.sector_ciudadano,
                so.email_ciudadano,
                so.celular_ciudadano,
                so.codigo_seguimiento,
                so.pin_seguridad,
                ars.nombre AS area_sugerida,
                ara.nombre AS area_asignada,
                so.asunto,
                so.contenido,
                TO_CHAR(so.fecha_envio, 'DD/MM/YYYY HH24:MI:SS') AS fecha_envio,
                cn.nombre AS canal_notificacion,
                cs.nombre AS canal_solicitud,
                es.nombre AS estado_solicitud,
                us.nombres || us.apellidos AS usuario_tramite
            FROM solicitudes so
            INNER JOIN areas ars ON so.area_sugerida_id = ars.id
            LEFT JOIN areas ara ON so.area_asignada_id = ara.id
            INNER JOIN canales_notificacion cn ON so.canal_notificacion_id = cn.id
            INNER JOIN canales_solicitud cs ON so.canal_solicitud_id =  cs.id
            INNER JOIN estados_solicitud es ON so.estado_solicitud_id = es.id
            LEFT JOIN usuarios us ON so.usuario_id = us.id
            WHERE so.codigo_seguimiento = $1`,
            [codigo_seguimiento]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear una nueva solicitud con todos los datos requeridos
    async createRequest({ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano,      direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, area_sugerida_id, asunto, contenido, pin_seguridad, canal_notificacion_id, canal_solicitud_id, usuario_id
    }) {
        const result = await db.query(
            `INSERT INTO solicitudes (
                codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano,
                direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento,
                area_sugerida_id, asunto, contenido, pin_seguridad, canal_notificacion_id, canal_solicitud_id, usuario_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano,
                sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, area_sugerida_id, asunto,
                contenido, pin_seguridad, canal_notificacion_id, canal_solicitud_id, usuario_id
            ]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

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

    // Asignar un area a la solicitud
    async updateAsignAreaRequest(codigo_solicitud, area_asignada_id) {
        const result = await db.query(
            `UPDATE solicitudes
             SET area_asignada_id = $1
             WHERE codigo_solicitud = $2
             RETURNING *`,
            [area_asignada_id, codigo_solicitud]
        );
        return result.rows[0];
    }

    // Asignar un area y cambiar su estado de solicitud
    async updateStatusAndAreaAsign(codigo_solicitud, estado_solicitud_id, area_asignada_id) {
        const result = await db.query(
            `UPDATE solicitudes
             SET estado_solicitud_id = $1,
                 area_asignada_id = $2
             WHERE codigo_solicitud = $3
             RETURNING *`,
            [estado_solicitud_id, area_asignada_id, codigo_solicitud]
        );
        return result.rows[0];
    }

}

// Exportamos una instancia del modelo
module.exports = new RequestModel();
