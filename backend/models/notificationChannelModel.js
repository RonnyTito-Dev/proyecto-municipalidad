// notificationChannelModel.js

// Importamos la db
const db = require('../config/db');

class NotificationChannelModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los canales
    async getAllChannels() {
        const result = await db.query(
            `SELECT
                cn.id,
                cn.nombre,
                cn.descripcion,
                TO_CHAR(cn.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_notificacion cn
            INNER JOIN estados_registro er ON cn.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener solo canales activos
    async getActiveChannels() {
        const result = await db.query(
            `SELECT
                cn.id,
                cn.nombre,
                cn.descripcion,
                TO_CHAR(cn.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_notificacion cn
            INNER JOIN estados_registro er ON cn.estado_registro_id = er.id
            WHERE cn.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener solo canales eliminados
    async getDeletedChannels() {
        const result = await db.query(
            `SELECT
                cn.id,
                cn.nombre,
                cn.descripcion,
                TO_CHAR(cn.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM canales_notificacion cn
            INNER JOIN estados_registro er ON cn.estado_registro_id = er.id
            WHERE cn.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener un canal por ID
    async getChannelById(id) {
        const result = await db.query('SELECT * FROM canales_notificacion WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener un canal por nombre
    async getChannelByName(nombre) {
        const result = await db.query('SELECT * FROM canales_notificacion WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }


    // ============================= MÉTODO POST ==============================

    // Crear un nuevo canal de notificación
    async createChannel({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO canales_notificacion (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ===============================

    // Actualizar un canal por ID
    async updateChannel(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE canales_notificacion
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH =============================

    // Eliminado lógica
    async deleteChannel(id) {
        await db.query(
            `UPDATE canales_notificacion
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreChannel(id) {
        await db.query(
            `UPDATE canales_notificacion
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new NotificationChannelModel();
