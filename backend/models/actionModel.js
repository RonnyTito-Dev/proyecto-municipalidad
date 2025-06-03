// actionModel.js

// Importamos la DB
const db = require('../config/db');

class ActionModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las acciones detallado
    async getAllActions() {
        const result = await db.query(
            `SELECT
                ac.id,
                ac.nombre,
                ac.descripcion,
                TO_CHAR(ac.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM acciones ac
            INNER JOIN estados_registro er ON ac.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener acciones activas
    async getActiveActions() {
        const result = await db.query(
            `SELECT
                ac.id,
                ac.nombre,
                ac.descripcion,
                TO_CHAR(ac.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM acciones ac
            INNER JOIN estados_registro er ON ac.estado_registro_id = er.id
            WHERE ac.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener acciones eliminadas
    async getDeletedActions() {
        const result = await db.query(
            `SELECT
                ac.id,
                ac.nombre,
                ac.descripcion,
                TO_CHAR(ac.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM acciones ac
            INNER JOIN estados_registro er ON ac.estado_registro_id = er.id
            WHERE ac.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener una acción por ID
    async getActionById(id) {
        const result = await db.query(
            'SELECT * FROM acciones WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener una acción por nombre
    async getActionByName(nombre) {
        const result = await db.query(
            'SELECT * FROM acciones WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST ==============================

    // Crear una nueva acción
    async createAction({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO acciones (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar nombre y descripción de una acción
    async updateAction(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE acciones
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH ============================

    // Eliminación lógica
    async deleteAction(id) {
        await db.query(
            `UPDATE acciones
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreAction(id) {
        await db.query(
            `UPDATE acciones
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new ActionModel();
