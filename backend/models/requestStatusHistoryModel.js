// requestStatusHistoryModel.js --- Historial de estados de la solicitud

// Importar la DB
const db = require('../config/db');

class RequestStatusHistoryModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todo el historial de cambios de estado (sin filtro)
    async getAllStatusHistories() {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud ORDER BY fecha_cambio DESC'
        );
        return result.rows;
    }

    // Obtener historial activo (estado_registro_id = 1)
    async getActiveStatusHistories() {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE estado_registro_id = 1 ORDER BY fecha_cambio DESC'
        );
        return result.rows;
    }

    // Obtener historial eliminado (estado_registro_id = 2)
    async getDeletedStatusHistories() {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE estado_registro_id = 2 ORDER BY fecha_cambio DESC'
        );
        return result.rows;
    }

    // Obtener historial por código de solicitud
    async getStatusHistoriesByRequestCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE codigo_solicitud = $1 ORDER BY fecha_cambio DESC',
            [codigo_solicitud]
        );
        return result.rows;
    }

    // Obtener historial por ID
    async getStatusHistoryById(id) {
        const result = await db.query(
            'SELECT * FROM historial_estados_solicitud WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo registro en historial de estados
    async createStatusHistory({
        codigo_solicitud,
        estado_solicitud_id,
        area_id,
        observaciones,
        usuario_id
    }) {
        const result = await db.query(
            `INSERT INTO historial_estados_solicitud (
                codigo_solicitud,
                estado_solicitud_id,
                area_id,
                observaciones,
                usuario_id
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [codigo_solicitud, estado_solicitud_id, area_id, observaciones, usuario_id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un registro del historial por ID
    async updateStatusHistory(id, {
        codigo_solicitud,
        estado_solicitud_id,
        area_id,
        observaciones,
        usuario_id
    }) {
        const result = await db.query(
            `UPDATE historial_estados_solicitud
             SET codigo_solicitud = $1,
                 estado_solicitud_id = $2,
                 area_id = $3,
                 observaciones = $4,
                 usuario_id = $5
             WHERE id = $6
             RETURNING *`,
            [codigo_solicitud, estado_solicitud_id, area_id, observaciones, usuario_id, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminación lógica: actualizar estado_registro_id a 2 (eliminado)
    async deleteStatusHistory(id) {
        await db.query(
            `UPDATE historial_estados_solicitud
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new RequestStatusHistoryModel();
