// requestChannelModel.js

// Importar la base de datos
const db = require('../config/db');

class RequestChannelModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los canales de solicitud
    async getAllRequestChannels() {
        const result = await db.query(
            `SELECT
                cs.id,
                cs.nombre,
                cs.descripcion,
                TO_CHAR(cs.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_solicitud cs
            INNER JOIN estados_registro er ON cs.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener canales de solicitud activos
    async getActiveRequestChannels() {
        const result = await db.query(
            `SELECT
                cs.id,
                cs.nombre,
                cs.descripcion,
                TO_CHAR(cs.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_solicitud cs
            INNER JOIN estados_registro er ON cs.estado_registro_id = er.id
          	WHERE cs.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener canales de solicitud eliminados
    async getDeletedRequestChannels() {
        const result = await db.query(
            `SELECT
                cs.id,
                cs.nombre,
                cs.descripcion,
                TO_CHAR(cs.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_solicitud cs
            INNER JOIN estados_registro er ON cs.estado_registro_id = er.id
          	WHERE cs.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener un canal de solicitud por ID
    async getRequestChannelById(id) {
        const result = await db.query(
            'SELECT * FROM canales_solicitud WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un canal de solicitud por nombre
    async getRequestChannelByName(nombre) {
        const result = await db.query(
            'SELECT * FROM canales_solicitud WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo canal de solicitud
    async createRequestChannel({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO canales_solicitud (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un canal de solicitud por ID
    async updateRequestChannel(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE canales_solicitud
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH =============================

    // Eliminación lógica
    async deleteRequestChannel(id) {
        await db.query(
            `UPDATE canales_solicitud
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreRequestChannel(id) {
        await db.query(
            `UPDATE canales_solicitud
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new RequestChannelModel();
