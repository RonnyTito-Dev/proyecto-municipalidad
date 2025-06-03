// registerStatusModel.js

// Importamos la DB
const db = require('../config/db');

class RegisterStatusModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los estados de registro
    async getAllRegisterStatus() {
        const result = await db.query(
            `SELECT
                id,
                nombre,
                descripcion,
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion
            FROM estados_registro`
        );
        return result.rows;
    }

    // Obtener un estado de registro por ID
    async getRegisterStatusById(id) {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un estado de registro por nombre
    async getRegisterStatusByName(nombre) {
        const result = await db.query(
            'SELECT * FROM estados_registro WHERE nombre = $1',
            [nombre]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo estado de registro
    async createRegisterStatus({ nombre, descripcion }) {
        const result = await db.query(
            `INSERT INTO estados_registro (nombre, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar nombre y descripción de un estado de registro
    async updateRegisterStatus(id, { nombre, descripcion }) {
        const result = await db.query(
            `UPDATE estados_registro
             SET nombre = $1, descripcion = $2
             WHERE id = $3
             RETURNING *`,
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

}

// Exportamos una instancia del modelo
module.exports = new RegisterStatusModel();
