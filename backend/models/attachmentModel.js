// attachmentModel.js - Adjuntos

// Importamos la DB
const db = require('../config/db');

class AttachmentModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los archivos adjuntos
    async getAllAttachments() {
        const result = await db.query('SELECT * FROM adjuntos ORDER BY fecha_subida DESC');
        return result.rows;
    }

    // Obtener solo adjuntos activos (estado_registro_id = 1)
    async getActiveAttachments() {
        const result = await db.query(
            'SELECT * FROM adjuntos WHERE estado_registro_id = 1 ORDER BY fecha_subida DESC'
        );
        return result.rows;
    }

    // Obtener solo adjuntos eliminados (estado_registro_id = 2)
    async getDeletedAttachments() {
        const result = await db.query(
            'SELECT * FROM adjuntos WHERE estado_registro_id = 2 ORDER BY fecha_subida DESC'
        );
        return result.rows;
    }

    // Obtener archivo adjunto por ID
    async getAttachmentById(id) {
        const result = await db.query('SELECT * FROM adjuntos WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener archivo adjunto por URL
    async getAttachmentByURL(url_archivo) {
        const result = await db.query('SELECT * FROM adjuntos WHERE url_archivo = $1', [url_archivo]);
        return result.rows[0];
    }

    // Obtener archivos adjuntos por código de solicitud
    async getAttachmentsByRequestCode(codigo_solicitud) {
        const result = await db.query(
            'SELECT * FROM adjuntos WHERE codigo_solicitud = $1 AND estado_registro_id = 1 ORDER BY fecha_subida DESC',
            [codigo_solicitud]
        );
        return result.rows;
    }

    // ============================= MÉTODO POST ==============================

    // Crear nuevo archivo adjunto
    async createAttachment({ codigo_solicitud, descripcion, url_archivo }) {
        const result = await db.query(
            `INSERT INTO adjuntos (codigo_solicitud, descripcion, url_archivo)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [codigo_solicitud, descripcion, url_archivo]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un archivo adjunto por ID
    async updateAttachment(id, { descripcion, url_archivo }) {
        const result = await db.query(
            `UPDATE adjuntos
             SET descripcion = $1,
                 url_archivo = $2
             WHERE id = $3
             RETURNING *`,
            [descripcion, url_archivo, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminado lógico: cambiar estado_registro_id a 2
    async deleteAttachment(id) {
        await db.query(
            `UPDATE adjuntos
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new AttachmentModel();
