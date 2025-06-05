// userSignatureModel.js

// Importar la conexión a la base de datos
const db = require('../config/db');

class UserSignatureModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas de usuarios
    async getAllSignatures() {
        const result = await db.query(
            `SELECT
                fu.id,
                us.nombres,
                us.apellidos,
                us.email,
                fu.ruta_firma,
                fu.activo,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida
            FROM firmas_usuarios fu
            INNER JOIN usuarios us ON fu.usuario_id = us.id
            ORDER BY fu.id DESC`
        );
        return result.rows;
    }

    // Obtener todas las firmas activas
    async getActiveSignatures() {
        const result = await db.query(
            `SELECT
                fu.id,
                us.nombres,
                us.apellidos,
                us.email,
                fu.ruta_firma,
                fu.activo,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida
            FROM firmas_usuarios fu
            INNER JOIN usuarios us ON fu.usuario_id = us.id
            WHERE fu.activo = true
            ORDER BY fu.id DESC`
        );
        return result.rows;
    }

    // Obtener todas las firmas inactivas
    async getInactiveSignatures() {
        const result = await db.query(
            `SELECT
                fu.id,
                us.nombres,
                us.apellidos,
                us.email,
                fu.ruta_firma,
                fu.activo,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida
            FROM firmas_usuarios fu
            INNER JOIN usuarios us ON fu.usuario_id = us.id
            WHERE fu.activo = false
            ORDER BY fu.id DESC`
        );
        return result.rows;
    }

    // Obtener una firma por ID (versión simple)
    async getSignatureById(id) {
        const result = await db.query(
            'SELECT * FROM firmas_usuarios WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener una firma por Ruta (versión simple)
    async getSignatureByPath(ruta_firma) {
        const result = await db.query(
            'SELECT * FROM firmas_usuarios WHERE ruta_firma = $1',
            [ruta_firma]
        );
        return result.rows[0];
    }

    // Obtener la firma activa de un usuario
    async getActiveSignatureByUserId(usuario_id) {
        const result = await db.query(
            `SELECT
                fu.id,
                fu.usuario_id,
                fu.ruta_firma,
                fu.activo,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida
            FROM firmas_usuarios fu
            WHERE fu.usuario_id = $1 AND fu.activo = true
            LIMIT 1`,
            [usuario_id]
        );
        return result.rows[0];
    }

    // Obtener todas las firmas de un usuario ya sea activas o inactivas
    async getSignaturesByUserId(usuario_id) {
        const result = await db.query(
            `SELECT
                fu.id,
                us.nombres,
                us.apellidos,
                us.email,
                fu.ruta_firma,
                fu.activo,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida
            FROM firmas_usuarios fu
            INNER JOIN usuarios us ON fu.usuario_id = us.id
            WHERE fu.usuario_id = $1
            ORDER BY fu.id DESC`,
            [usuario_id]
        );
        return result.rows;
    }

    // ============================= MÉTODO POST =============================

    // Agregar una nueva firma
    async createSignature({ usuario_id, ruta_firma }) {
        const result = await db.query(
            `INSERT INTO firmas_usuarios (usuario_id, ruta_firma)
             VALUES ($1, $2)
             RETURNING *`,
            [usuario_id, ruta_firma]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT =============================

    // Activar una firma específica y desactivar las demás
    async activateSignature(id, usuario_id) {
        await db.query(
            `UPDATE firmas_usuarios
             SET activo = false
             WHERE usuario_id = $1`,
            [usuario_id]
        );

        const result = await db.query(
            `UPDATE firmas_usuarios
             SET activo = true
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        return result.rows[0];
    }

    // Desactivar todas las firmas de un usuario
    async deactivateAllSignatures(usuario_id) {
        await db.query(
            `UPDATE firmas_usuarios
             SET activo = false
             WHERE usuario_id = $1`,
            [usuario_id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new UserSignatureModel();
