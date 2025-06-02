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
                er.nombre as estado
            FROM logs lo
            INNER JOIN usuarios us ON lo.usuario_id = us.id
            INNER JOIN roles ro ON lo.rol_id = ro.id
            INNER JOIN areas ar ON lo.area_id = ar.id
            INNER JOIN acciones ac ON lo.accion_id = ac.id
            INNER JOIN estados_registro er ON lo.estados_registro_id = er.id
            ORDER BY lo.id DESC`
        );
        return result.rows;
    }

    // Obtener logs activos
    async getActiveLogs() {
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
                TO_CHAR(lo.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro,
                er.nombre as estado
            FROM logs lo
            INNER JOIN usuarios us ON lo.usuario_id = us.id
            INNER JOIN roles ro ON lo.rol_id = ro.id
            INNER JOIN areas ar ON lo.area_id = ar.id
            INNER JOIN acciones ac ON lo.accion_id = ac.id
            INNER JOIN estados_registro er ON lo.estado_registro_id = er.id
            WHERE lo.estado_registro_id = 1
            ORDER BY lo.id DESC`
        );
        return result.rows;
    }

    // Obtener logs eliminados
    async getDeletedLogs() {
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
                TO_CHAR(lo.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro,
                er.nombre as estado
            FROM logs lo
            INNER JOIN usuarios us ON lo.usuario_id = us.id
            INNER JOIN roles ro ON lo.rol_id = ro.id
            INNER JOIN areas ar ON lo.area_id = ar.id
            INNER JOIN acciones ac ON lo.accion_id = ac.id
            INNER JOIN estados_registro er ON lo.estado_registro_id = er.id
            WHERE lo.estado_registro_id = 2
            ORDER BY lo.id DESC`
        );
        return result.rows;
    }

    // Obtener log por ID
    async getLogById(id) {
        const result = await db.query(
            'SELECT * FROM logs WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener logs por usuario_id
    async getLogsByUserId(usuario_id) {
        const result = await db.query(
            'SELECT * FROM logs WHERE usuario_id = $1 ORDER BY id',
            [usuario_id]
        );
        return result.rows;
    }

    // Obtener logs por area_id
    async getLogsByAreaId(area_id) {
        const result = await db.query(
            'SELECT * FROM logs WHERE area_id = $1 ORDER BY id',
            [area_id]
        );
        return result.rows;
    }

    // Obtener logs por accion_id
    async getLogsByActionId(accion_id) {
        const result = await db.query(
            'SELECT * FROM logs WHERE accion_id = $1 ORDER BY id',
            [accion_id]
        );
        return result.rows;
    }

    // Obtener logs por tabla_afectada
    async getLogsByTable(tabla_afectada) {
        const result = await db.query(
            'SELECT * FROM logs WHERE tabla_afectada = $1 ORDER BY id',
            [tabla_afectada]
        );
        return result.rows;
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo log
    async createLog({ usuario_id, area_id, tabla_afectada, accion_id, descripcion }) {
        const result = await db.query(
            `INSERT INTO logs (usuario_id, area_id, tabla_afectada, accion_id, descripcion)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [usuario_id, area_id, tabla_afectada, accion_id, descripcion]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un log por ID
    async updateLog(id, { usuario_id, area_id, tabla_afectada, accion_id, descripcion }) {
        const result = await db.query(
            `UPDATE logs
             SET usuario_id = $1,
                 area_id = $2,
                 tabla_afectada = $3,
                 accion_id = $4,
                 descripcion = $5
             WHERE id = $6
             RETURNING *`,
            [usuario_id, area_id, tabla_afectada, accion_id, descripcion, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO DELETE ============================

    // Eliminación lógica: cambiar estado_registro_id a 2 (eliminado)
    async deleteLog(id) {
        await db.query(
            `UPDATE logs
             SET estado_registro_id = 2
             WHERE id = $1`,
            [id]
        );
    }
}

// Exportamos una instancia del modelo
module.exports = new LogModel();
