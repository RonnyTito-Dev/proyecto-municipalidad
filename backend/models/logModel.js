// models/logModel.js

// Importamos la DB
const db = require('../config/db');

class LogModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los logs detallado
    async getAllLogs() {
        const result = await db.query(
            `SELECT
                lo.id,
                us.nombres,
                us.apellidos,
                us.email,
                ro.nombre AS rol,
                ar.nombre AS area,
                lo.tabla_afectada,
                ac.nombre AS accion,
                TO_CHAR(lo.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro
            FROM logs lo
            INNER JOIN usuarios us ON lo.usuario_id = us.id
            INNER JOIN roles ro ON lo.rol_id = ro.id
            INNER JOIN areas ar ON lo.area_id = ar.id
            INNER JOIN acciones ac ON lo.accion_id = ac.id
            ORDER BY lo.id DESC`
        );
        return result.rows;
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo log
    async createLog({ usuario_id, rol_id, area_id, tabla_afectada, accion_id }) {
        const result = await db.query(
            `INSERT INTO logs (usuario_id, rol_id, area_id, tabla_afectada, accion_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [usuario_id, rol_id, area_id, tabla_afectada, accion_id]
        );
        return result.rows[0];
    }

}

// Exportamos una instancia del modelo
module.exports = new LogModel();
