// recordStatusModel.js

// Importamos la DB
const db = require('../config/db');

class RecordStatusModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados de registro (sin filtrar)
    async getAllStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_registro ORDER BY id'
        );
        return result.rows;
    }

    // Obtener estados activos (estado_registro_id = 1)
    async getActiveStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener estados eliminados (estado_registro_id = 2)
    async getDeletedStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE estado_registro_id = 2 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener un estado de registro por ID
    async getStatusById(id) {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un estado de registro por nombre
    async getStatusByName(nombre) {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo estado de registro
    async createStatus({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO estados_registro (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar nombre y descripción de un estado de registro
    async updateStatus(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE estados_registro
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
            `UPDATE estados_registro
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new RecordStatusModel();
