// userSignatureModel.js

// Importar al DB
const db = require('../config/db');

class UserSignatureModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas de usuario
    async getAllSignatures() {
        const result = await db.query(
            `SELECT
                fu.id,
                us.nombres AS nombres,
                us.apellidos AS apellidos,
                us.email AS email,
                fu.ruta_firma,
                TO_CHAR(fu.fecha_subida, 'DD/MM/YYYY HH24:MI:SS') AS fecha_subida,
                er.id AS id_estado,
                er.nombre AS estado
            FROM firmas_usuarios fu
            INNER JOIN usuarios us ON fu.usuario_id = us.id
            INNER JOIN estados_registro er ON fu.estado_registro_id = er.id
            ORDER BY fu.id DESC`
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

    // Obtener firmas por usuario_id
    async getSignatureByUserId(usuario_id) {
        const result = await db.query(
            'SELECT * FROM firmas_usuario WHERE usuario_id = $1 AND estado_registro_id = 1 ORDER BY id DESC',
            [usuario_id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Agregar una nueva firma
    async createSignature({ usuario_id, ruta_firma }) {
        const result = await db.query(
            `INSERT INTO firmas_usuario (usuario_id, ruta_firma)
       VALUES ($1, $2)
       RETURNING *`,
            [usuario_id, ruta_firma]
        );
        return result.rows[0];
    }
}

// Exportar una instancia del modelo
module.exports = new UserSignatureModel();
