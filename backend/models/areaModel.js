// areaModel.js

// Importamos la DB
const db = require('../config/db');

class AreaModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las áreas (sin importar estado)
    async getAllAreas() {
        const result = await db.query('SELECT * FROM areas ORDER BY id');
        return result.rows;
    }

    // Obtener solo áreas activas
    async getActiveAreas() {
        const result = await db.query(
            'SELECT * FROM areas WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener solo áreas eliminadas
    async getDeletedAreas() {
        const result = await db.query(
            'SELECT * FROM areas WHERE estado_registro_id = 2 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener un área por ID
    async getAreaById(id) {
        const result = await db.query('SELECT * FROM areas WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener un área por nombre
    async getAreaByName(nombre) {
        const result = await db.query('SELECT * FROM areas WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear una nueva área
    async createArea({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO areas (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar datos de un área
    async updateArea(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE areas
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE ============================

    // Eliminado lógico: actualiza estado_registro_id a 2
    async deleteArea(id) {
        await db.query(
            `UPDATE areas
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new AreaModel();
