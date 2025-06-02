// documentTypeModel.js

// Importamos la DB
const db = require('../config/db');

class DocumentTypeModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los tipos de documento (sin filtro)
    async getAllDocumentTypes() {
        const result = await db.query('SELECT * FROM tipos_documento ORDER BY nombre');
        return result.rows;
    }

    // Obtener solo tipos activos (estado_registro_id = 1)
    async getActiveDocumentTypes() {
        const result = await db.query('SELECT * FROM tipos_documento WHERE estado_registro_id = 1 ORDER BY nombre');
        return result.rows;
    }

    // Obtener solo tipos eliminados (estado_registro_id = 2)
    async getDeletedDocumentTypes() {
        const result = await db.query('SELECT * FROM tipos_documento WHERE estado_registro_id = 2 ORDER BY nombre');
        return result.rows;
    }

    // Obtener tipo de documento por ID
    async getDocumentTypeById(id) {
        const result = await db.query('SELECT * FROM tipos_documento WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener tipo de documento por nombre
    async getDocumentTypeByName(nombre) {
        const result = await db.query('SELECT * FROM tipos_documento WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    // ============================= MÉTODO POST ==============================

    // Crear nuevo tipo de documento
    async createDocumentType({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO tipos_documento (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ===============================

    // Actualizar tipo de documento por ID
    async updateDocumentType(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE tipos_documento
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminado lógico: cambiar estado_registro_id a 2
    async deleteDocumentType(id) {
        await db.query(
            `UPDATE tipos_documento
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new DocumentTypeModel();
