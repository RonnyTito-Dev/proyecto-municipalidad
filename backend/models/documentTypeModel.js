// documentTypeModel.js

// Importamos la DB
const db = require('../config/db');

class DocumentTypeModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los tipos de documento
    async getAllDocumentTypes() {
        const result = await db.query(
            `SELECT
                td.id,
                td.nombre,
                td.descripcion,
                TO_CHAR(td.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
			FROM tipos_documento td
            INNER JOIN estados_registro er ON td.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener solo tipos activos
    async getActiveDocumentTypes() {
        const result = await db.query(
            `SELECT
                td.id,
                td.nombre,
                td.descripcion,
                TO_CHAR(td.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
			FROM tipos_documento td
            INNER JOIN estados_registro er ON td.estado_registro_id = er.id
            WHERE td.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener solo tipos eliminados
    async getDeletedDocumentTypes() {
        const result = await db.query(
            `SELECT
                td.id,
                td.nombre,
                td.descripcion,
                TO_CHAR(td.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
			FROM tipos_documento td
            INNER JOIN estados_registro er ON td.estado_registro_id = er.id
            WHERE td.estado_registro_id = 2`
        );
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

    // ============================ MÉTODO PATCH =============================

    // Eliminado lógica
    async deleteDocumentType(id) {
        await db.query(
            `UPDATE tipos_documento
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreDocumentType(id) {
        await db.query(
            `UPDATE tipos_documento
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new DocumentTypeModel();
