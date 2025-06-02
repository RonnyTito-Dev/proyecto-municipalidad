// requestStatusModel.js

// Importamos la DB
const db = require('../config/db');

class RequestStatusModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados de solicitud
    async getAllRequestStatuses() {
        const result = await db.query('SELECT * FROM estados_solicitud ORDER BY id');
        return result.rows;
    }

    // Obtener estados activos (estado_registro_id = 1)
    async getActiveRequestStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_solicitud WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener estados inactivos (estado_registro_id = 2)
    async getInactiveRequestStatuses() {
        const result = await db.query(
            'SELECT * FROM estados_solicitud WHERE estado_registro_id = 2 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener un estado por ID
    async getRequestStatusById(id) {
        const result = await db.query(
            'SELECT * FROM estados_solicitud WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un estado por nombre
    async getRequestStatusByName(nombre) {
        const result = await db.query(
            'SELECT * FROM estados_solicitud WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo estado
    async createRequestStatus({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO estados_solicitud (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar estado por ID
    async updateRequestStatus(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE estados_solicitud
             SET nombre = $1,
                 descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE ============================

    // Eliminar estado por ID (eliminación física)
    async deleteRequestStatus(id) {
        await db.query(
            `UPDATE estados_solicitud
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new RequestStatusModel();
