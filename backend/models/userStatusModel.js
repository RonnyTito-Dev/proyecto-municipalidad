// userStatusModel.js

// Importamos la DB
const db = require('../config/db');

class UserStatusModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados
    async getAllStatuses() {
        const result = await db.query(
            `SELECT
                eu.id,
                eu.nombre,
                eu.descripcion,
                TO_CHAR(eu.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM estados_usuario eu
            INNER JOIN estados_registro er ON eu.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener estados activos
    async getActiveStatuses() {
        const result = await db.query(
            `SELECT
                eu.id,
                eu.nombre,
                eu.descripcion,
                TO_CHAR(eu.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM estados_usuario eu
            INNER JOIN estados_registro er ON eu.estado_registro_id = er.id
            WHERE eu.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener estados eliminados
    async getDeletedStatuses() {
        const result = await db.query(
            `SELECT
                eu.id,
                eu.nombre,
                eu.descripcion,
                TO_CHAR(eu.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM estados_usuario eu
            INNER JOIN estados_registro er ON eu.estado_registro_id = er.id
            WHERE eu.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener un estado por ID
    async getStatusById(id) {
        const result = await db.query(
            'SELECT * FROM estados_usuario WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un estado por nombre
    async getStatusByName(nombre) {
        const result = await db.query(
            'SELECT * FROM estados_usuario WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo estado de usuario
    async createStatus({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO estados_usuario (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar nombre y descripción de un estado de usuario
    async updateStatus(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE estados_usuario
       SET nombre = $1, descripcion = $2
       WHERE id = $3
       RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH ============================

    // Eliminación lógica
    async deleteStatus(id) {
        await db.query(
            `UPDATE estados_usuario
       SET estado_registro_id = 2
       WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreStatus(id) {
        await db.query(
            `UPDATE estados_usuario
       SET estado_registro_id = 1
       WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos un instancia del modelo
module.exports = new UserStatusModel();
