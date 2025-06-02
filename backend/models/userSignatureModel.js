// userSignatureModel.js

// Importar al DB
const db = require('../config/db');

class UserSignatureModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas de usuario (sin filtro)
    async getAllSignatures() {
        const result = await db.query(
            'SELECT * FROM firmas_usuario ORDER BY id'
        );
        return result.rows;
    }

    // Obtener firmas activas (estado_registro_id = 1)
    async getActiveSignatures() {
        const result = await db.query(
            'SELECT * FROM firmas_usuario WHERE estado_registro_id = 1 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener firmas eliminadas (estado_registro_id = 2)
    async getDeletedSignatures() {
        const result = await db.query(
            'SELECT * FROM firmas_usuario WHERE estado_registro_id = 2 ORDER BY id'
        );
        return result.rows;
    }

    // Obtener una firma por ID
    async getSignatureById(id) {
        const result = await db.query(
            'SELECT * FROM firmas_usuario WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener una firma por usuario_id
    async getSignatureByUserId(usuario_id) {
        const result = await db.query(
            'SELECT * FROM firmas_usuario WHERE usuario_id = $1',
            [usuario_id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear una nueva firma para un usuario (única por usuario)
    async createSignature({ usuario_id, ruta_firma }) {
        const result = await db.query(
            `INSERT INTO firmas_usuario (usuario_id, ruta_firma)
       VALUES ($1, $2)
       RETURNING *`,
            [usuario_id, ruta_firma]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar la ruta de la firma para un usuario
    async updateSignature(usuario_id, ruta_firma) {
        const result = await db.query(
            `UPDATE firmas_usuario
       SET ruta_firma = $1, fecha_carga = CURRENT_TIMESTAMP
       WHERE usuario_id = $2
       RETURNING *`,
            [ruta_firma, usuario_id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE =============================

    // Eliminación lógica: actualizar estado_registro_id a 2 para marcar firma como eliminada
    async deleteSignatureByUserId(usuario_id) {
        await db.query(
            `UPDATE firmas_usuario
       SET estado_registro_id = 2
       WHERE usuario_id = $1`,
            [usuario_id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new UserSignatureModel();
