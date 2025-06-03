// roleModel.js

// Importamos la DB
const db = require('../config/db');

class RoleModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los roles
    async getAllRoles() {
        const result = await db.query(
            `SELECT
                r.id,
                r.nombre,
                r.descripcion,
                TO_CHAR(r.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM roles r
            INNER JOIN estados_registro er ON r.estado_registro_id = er.id`
        );
        return result.rows;
    }

    // Obtener solo roles activos
    async getActiveRoles() {
        const result = await db.query(
            `SELECT
                r.id,
                r.nombre,
                r.descripcion,
                TO_CHAR(r.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM roles r
            INNER JOIN estados_registro er ON r.estado_registro_id = er.id
            WHERE r.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener solo roles eliminados
    async getDeletedRoles() {
        const result = await db.query(
            `SELECT
                r.id,
                r.nombre,
                r.descripcion,
                TO_CHAR(r.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado,
                er.nombre AS estado
            FROM roles r
            INNER JOIN estados_registro er ON r.estado_registro_id = er.id
            WHERE r.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener un rol por ID
    async getRoleById(id) {
        const result = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Obtener un rol por nombre
    async getRoleByName(nombre) {
        const result = await db.query('SELECT * FROM roles WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo rol
    async createRole({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO roles (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar datos de un rol
    async updateRole(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE roles
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH ============================

    // Eliminado lógico
    async deleteRole(id) {
        await db.query(
            `UPDATE roles
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }

    // Restauración lógica
    async restoreRole(id) {
        await db.query(
            `UPDATE roles
             SET estado_registro_id = 1
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new RoleModel();
