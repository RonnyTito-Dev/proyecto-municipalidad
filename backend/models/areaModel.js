// areaModel.js

// Importamos la DB
const db = require('../config/db');

class AreaModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las áreas
    async getAllAreas() {
        const result = await db.query(
            `SELECT
                ar.id,
                ar.nombre,
                ar.descripcion,
                ar.area_publica,
                TO_CHAR(ar.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM areas ar
            INNER JOIN estados_registro er ON ar.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener solo áreas activas
    async getActiveAreas() {
        const result = await db.query(
            `SELECT
                ar.id,
                ar.nombre,
                ar.descripcion,
                ar.area_publica,
                TO_CHAR(ar.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM areas ar
            INNER JOIN estados_registro er ON ar.estado_registro_id = er.id
            WHERE ar.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener solo áreas eliminadas
    async getDeletedAreas() {
        const result = await db.query(
            `SELECT
                ar.id,
                ar.nombre,
                ar.descripcion,
                ar.area_publica,
                TO_CHAR(ar.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM areas ar
            INNER JOIN estados_registro er ON ar.estado_registro_id = er.id
            WHERE ar.estado_registro_id = 2`
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

    // Cambiar visibilidad pública de un área
    async updateAreaVisibility(id, area_publica) {
        const result = await db.query(
            `UPDATE areas
         SET area_publica = $1
         WHERE id = $2
         RETURNING *`,
            [area_publica, id]
        );
        return result.rows[0];
    }


    // ============================ MÉTODO PATCH ============================

    // Eliminado lógica
    async deleteArea(id) {
        await db.query(
            `UPDATE areas
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreArea(id) {
        await db.query(
            `UPDATE areas
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new AreaModel();
