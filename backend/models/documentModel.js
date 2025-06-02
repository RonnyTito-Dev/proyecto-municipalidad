// documentModel.js

// Importar al DB
const db = require('../config/db');

class DocumentModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los documentos
    async getAllDocuments() {
        const result = await db.query('SELECT * FROM documentos ORDER BY fecha_creacion DESC');
        return result.rows;
    }

    // Obtener solo documentos activos (estado_registro_id = 1)
    async getActiveDocuments() {
        const result = await db.query(
            'SELECT * FROM documentos WHERE estado_registro_id = 1 ORDER BY fecha_creacion DESC'
        );
        return result.rows;
    }

    // Obtener solo documentos eliminados (estado_registro_id = 2)
    async getDeletedDocuments() {
        const result = await db.query(
            'SELECT * FROM documentos WHERE estado_registro_id = 2 ORDER BY fecha_creacion DESC'
        );
        return result.rows;
    }

    // Obtener documento por ID
    async getDocumentById(id) {
        const result = await db.query('SELECT * FROM documentos WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener documento por URL
    async getDocumentByURL(url_documento) {
        const result = await db.query('SELECT * FROM documentos WHERE url_documento = $1', [url_documento]);
        return result.rows[0];
    }

    // Obtener documentos activos por código de solicitud
    async getDocumentsByRequestCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM documentos WHERE codigo_solicitud = $1 AND estado_registro_id = 1 ORDER BY fecha_creacion DESC',
            [codigo_solicitud]
        );
        return result.rows;
    }

    // Obtener documentos por tipo de documento
    async getDocumentsByDocumentType(tipo_documento_id) {
        const result = await db.query(
            `SELECT * FROM documentos
             WHERE tipo_documento_id = $1 AND estado_registro_id = 1
             ORDER BY fecha_creacion DESC`,
            [tipo_documento_id]
        );
        return result.rows;
    }

    // ============================= MÉTODO POST ==============================

    // Crear nuevo documento
    async createDocument({ codigo_solicitud, tipo_documento_id, url_documento }) {
        const result = await db.query(
            `INSERT INTO documentos (codigo_solicitud, tipo_documento_id, url_documento)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [codigo_solicitud, tipo_documento_id, url_documento]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar documento por ID
    async updateDocument(id, { codigo_solicitud, tipo_documento_id, url_documento }) {
        const result = await db.query(
            `UPDATE documentos
             SET codigo_solicitud = $1, tipo_documento_id = $2, url_documento = $3
             WHERE id = $4
             RETURNING *`,
            [codigo_solicitud, tipo_documento_id, url_documento, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE ============================

    // Eliminado lógico: cambiar estado_registro_id a 2
    async deleteDocument(id) {
        await db.query(
            `UPDATE documentos
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new DocumentModel();
