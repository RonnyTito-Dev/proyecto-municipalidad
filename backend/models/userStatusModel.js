// userStatusModel.js

// Importamos la DB
const db = require('../config/db');

class UserStatusModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados (sin filtrar por estado_registro_id)
    async getAllStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_usuario ORDER BY id'
        );
        return result.rows;
    }

    // Obtener estados activos (estado_registro_id = 1)
    async getActiveStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_usuario WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener estados eliminados (estado_registro_id = 2)
    async getDeletedStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_usuario WHERE estado_registro_id = 2 ORDER BY id'
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

    // ============================ MÉTODO DELETE ============================

    // Eliminación lógica: cambiar estado_registro_id a 2 (eliminado)
    async deleteStatus(id) {
        await db.query(
            `UPDATE estados_usuario
       SET estado_registro_id = 2
       WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos un instancia del modelo
module.exports = new UserStatusModel();
