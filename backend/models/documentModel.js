// documentModel.js

// Importar al DB
const db = require('../config/db');

class DocumentModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los documentos
    async getAllDocuments() {
        const result = await db.query(
            `SELECT
                doc.id,
                doc.codigo_solicitud,
                td.nombre AS tipo_documento,
                doc.url_documento,
                TO_CHAR(doc.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion
				FROM documentos doc
            INNER JOIN tipos_documento td ON doc.tipo_documento_id = td.id
            ORDER BY doc.id DESC`
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
            `SELECT
                doc.id,
                doc.codigo_solicitud,
                td.nombre AS tipo_documento,
                doc.url_documento,
                TO_CHAR(doc.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion
            FROM documentos doc
            INNER JOIN tipos_documento td ON doc.tipo_documento_id = td.id
            WHERE doc.codigo_solicitud = $1
            ORDER BY doc.id DESC`,
            [codigo_solicitud]
        );
        return result.rows;
    }

    // Obtener documentos por tipo de documento
    async getDocumentsByDocumentType(tipo_documento_id) {
        const result = await db.query(
            `SELECT * FROM documentos
             WHERE tipo_documento_id = $1
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

}

// Exportar una instancia del modelo
module.exports = new DocumentModel();
