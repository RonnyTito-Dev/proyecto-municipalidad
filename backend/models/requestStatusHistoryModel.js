// requestStatusHistoryModel.js --- Historial de estados de la solicitud

// Importar la DB
const db = require('../config/db');

class RequestStatusHistoryModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado
    async getAllStatusHistories() {
        const result = await db.query(
            `SELECT
				hes.id,
                hes.codigo_solicitud,
                es.nombre AS estado_solicitud,
                ara.nombre AS area_actual,
                ard.nombre AS area_destino,
                hes.notas,
                TO_CHAR(hes.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro
			FROM historial_estados_solicitud hes
            INNER JOIN estados_solicitud es ON hes.estado_solicitud_id = es.id
            LEFT JOIN areas ara ON hes.area_actual_id = ara.id
            LEFT JOIN areas ard ON hes.area_destino_id = ard.id
            ORDER BY hes.id DESC`
        );
        return result.rows;
    }


    // Obtener historial por código de solicitud - crudo
    async getStatusHistoriesByRequestCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE codigo_solicitud = $1 ORDER BY id DESC',
            [codigo_solicitud]
        );
        return result.rows;
    }

    // Obtener historial por código de seguiminto - detallado
    async getStatusHistoriesByTrackingCode(codigo_seguimiento) {
        const result = await db.query(
            `SELECT
				hes.id,
                hes.codigo_solicitud,
                so.codigo_seguimiento AS codigo_seguimiento,
                es.nombre AS estado_solicitud,
                ara.nombre AS area_actual,
                ard.nombre AS area_destino,
                hes.notas,
                TO_CHAR(hes.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro
				FROM historial_estados_solicitud hes
            INNER JOIN solicitudes so ON hes.codigo_solicitud = so.codigo_solicitud
            INNER JOIN estados_solicitud es ON hes.estado_solicitud_id = es.id
            LEFT JOIN areas ara ON hes.area_actual_id = ara.id
            LEFT JOIN areas ard ON hes.area_destino_id = ard.id
            WHERE so.codigo_seguimiento = $1
            ORDER BY hes.id DESC`,
            [codigo_seguimiento]
        );
        return result.rows;
    }


    // Obtener historial por id - crudo
    async getStatusHistoryById(id) {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE id = $1 ORDER BY id DESC',
            [id]
        );
        return result.rows;
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo registro en historial de estados
    async createStatusHistory({
        codigo_solicitud,
        estado_solicitud_id,
        area_actual_id,
        area_destino_id,
        notas,
        usuario_id
    }) {
        const result = await db.query(
            `INSERT INTO historial_estados_solicitud (
                codigo_solicitud,
                estado_solicitud_id,
                area_actual_id,
                area_destino_id,
                notas,
                usuario_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id]
        );
        return result.rows[0];
    }

}

// Exportar una instancia del modelo
module.exports = new RequestStatusHistoryModel();
