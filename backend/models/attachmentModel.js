// attachmentModel.js - Adjuntos

// Importamos la DB
const db = require('../config/db');

class AttachmentModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los archivos adjuntos
    async getAllAttachments() {
        const result = await db.query(
            `SELECT
                id,
                codigo_solicitud,
                descripcion,
                url_archivo,
                TO_CHAR(fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion
            FROM adjuntos
            ORDER BY id DESC`
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
            'SELECT * FROM adjuntos WHERE codigo_solicitud = $1 ORDER BY id DESC',
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

}

// Exportamos una instancia del modelo
module.exports = new AttachmentModel();
