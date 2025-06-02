// services/logService.js

// Importar el modelo
const logModel = require('../models/logModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class LogService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los logs en crudo
    async getLogsRaw() {
        const logs = await logModel.getAllLogsRaw();
        if (!logs || logs.length === 0) {
            throw ApiError.notFound('No hay logs registrados');
        }
        return logs;
    }

    // Obtener todos los logs saneados
    async getLogsDetailed() {
        const logs = await logModel.getAllLogsDetailed();
        if (!logs || logs.length === 0) {
            throw ApiError.notFound('No hay logs registrados');
        }
        return logs;
    }

    // Obtener solo logs activos
    async getActiveLogs() {
        const logs = await logModel.getActiveLogs();
        if (!logs || logs.length === 0) {
            throw ApiError.notFound('No hay logs activos registrados');
        }
        return logs;
    }

    // Obtener solo logs eliminados
    async getDeletedLogs() {
        const logs = await logModel.getDeletedLogs();
        if (!logs || logs.length === 0) {
            throw ApiError.notFound('No hay logs eliminados registrados');
        }
        return logs;
    }

    // Obtener log por ID
    async getLogById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del log debe ser un número entero positivo');
        }

        const log = await logModel.getLogById(id);
        if (!log) {
            throw ApiError.notFound(`Log con ID ${id} no encontrado`);
        }
        return log;
    }

    // Obtener logs por usuario_id
    async getLogsByUserId(usuario_id) {
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const logs = await logModel.getLogsByUserId(usuario_id);
        if (!logs || logs.length === 0) {
            throw ApiError.notFound(`No se encontraron logs para el usuario con ID ${usuario_id}`);
        }
        return logs;
    }

    // Obtener logs por area_id
    async getLogsByAreaId(area_id) {
        if (!area_id || isNaN(area_id) || Number(area_id) <= 0 || !Number.isInteger(Number(area_id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }

        const logs = await logModel.getLogsByAreaId(area_id);
        if (!logs || logs.length === 0) {
            throw ApiError.notFound(`No se encontraron logs para el área con ID ${area_id}`);
        }
        return logs;
    }

    // Obtener logs por accion_id
    async getLogsByActionId(accion_id) {
        if (!accion_id || isNaN(accion_id) || Number(accion_id) <= 0 || !Number.isInteger(Number(accion_id))) {
            throw ApiError.badRequest('El ID de la acción debe ser un número entero positivo');
        }

        const logs = await logModel.getLogsByActionId(accion_id);
        if (!logs || logs.length === 0) {
            throw ApiError.notFound(`No se encontraron logs para la acción con ID ${accion_id}`);
        }
        return logs;
    }

    // Obtener logs por tabla_afectada
    async getLogsByTable(tabla_afectada) {
        if (!tabla_afectada) {
            throw ApiError.badRequest('El nombre de la tabla afectada es requerido');
        }

        const tabla = formatter.toLowerCase(tabla_afectada);
        const logs = await logModel.getLogsByTable(tabla);
        if (!logs || logs.length === 0) {
            throw ApiError.notFound(`No se encontraron logs para la tabla "${tabla}"`);
        }
        return logs;
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo log
    async addLog(data) {
        const { usuario_id, area_id, tabla_afectada, accion_id, descripcion } = data;

        if (!usuario_id || !area_id || !tabla_afectada || !accion_id || !descripcion) {
            throw ApiError.badRequest('Todos los campos son obligatorios');
        }

        const tabla = formatter.toLowerCase(tabla_afectada);
        const desc = formatter.trim(descripcion);

        return await logModel.createLog({
            usuario_id,
            area_id,
            tabla_afectada: tabla,
            accion_id,
            descripcion: desc,
        });
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un log
    async modifyLog(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del log debe ser un número entero positivo');
        }

        const { usuario_id, area_id, tabla_afectada, accion_id, descripcion } = data;

        if (!usuario_id || !area_id || !tabla_afectada || !accion_id || !descripcion) {
            throw ApiError.badRequest('Todos los campos son obligatorios');
        }

        const existing = await logModel.getLogById(id);
        if (!existing) {
            throw ApiError.notFound(`Log con ID ${id} no encontrado`);
        }

        const tabla = formatter.toLowerCase(tabla_afectada);
        const desc = formatter.trim(descripcion);

        // Validar si no hay cambios
        if (
            existing.usuario_id === usuario_id &&
            existing.area_id === area_id &&
            existing.tabla_afectada === tabla &&
            existing.accion_id === accion_id &&
            existing.descripcion === desc
        ) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        return await logModel.updateLog(id, {
            usuario_id,
            area_id,
            tabla_afectada: tabla,
            accion_id,
            descripcion: desc,
        });
    }

    // ============================= MÉTODO DELETE ==============================

    // Eliminación lógica de un log
    async removeLog(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del log debe ser un número entero positivo');
        }

        const existing = await logModel.getLogById(id);
        if (!existing) {
            throw ApiError.notFound(`Log con ID ${id} no encontrado`);
        }

        await logModel.deleteLog(id);
    }
}

// Exportar instancia del servicio
module.exports = new LogService();
