// controllers/logController.js

// Importamos el servicio de logs
const logService = require('../services/logService');

class LogController {

    // ============================ MÉTODOS GET =============================

    // Obtener todos los logs en crudo
    async getLogsRaw(req, res, next) {
        try {
            const logs = await logService.getLogsRaw();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener todos los logs saneados
    async getLogsDetailed(req, res, next) {
        try {
            const logs = await logService.getLogsDetailed();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo logs activos
    async getActiveLogs(req, res, next) {
        try {
            const logs = await logService.getActiveLogs();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo logs eliminados
    async getDeletedLogs(req, res, next) {
        try {
            const logs = await logService.getDeletedLogs();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener log por ID
    async getLogById(req, res, next) {
        const { id } = req.params;
        try {
            const log = await logService.getLogById(id);
            res.json(log);
        } catch (error) {
            next(error);
        }
    }

    // Obtener logs por usuario_id
    async getLogsByUserId(req, res, next) {
        const { usuario_id } = req.params;
        try {
            const logs = await logService.getLogsByUserId(usuario_id);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener logs por area_id
    async getLogsByAreaId(req, res, next) {
        const { area_id } = req.params;
        try {
            const logs = await logService.getLogsByAreaId(area_id);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener logs por accion_id
    async getLogsByActionId(req, res, next) {
        const { accion_id } = req.params;
        try {
            const logs = await logService.getLogsByActionId(accion_id);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // Obtener logs por tabla_afectada
    async getLogsByTable(req, res, next) {
        const { tabla_afectada } = req.params;
        try {
            const logs = await logService.getLogsByTable(tabla_afectada);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO POST =============================

    // Crear un nuevo log
    async createLog(req, res, next) {
        const { usuario_id, area_id, tabla_afectada, accion_id, descripcion } = req.body;
        try {
            const newLog = await logService.addLog({ usuario_id, area_id, tabla_afectada, accion_id, descripcion });
            res.status(201).json(newLog);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO PUT ==============================

    // Actualizar un log por ID
    async updateLog(req, res, next) {
        const { id } = req.params;
        const { usuario_id, area_id, tabla_afectada, accion_id, descripcion } = req.body;
        try {
            const updatedLog = await logService.modifyLog(id, { usuario_id, area_id, tabla_afectada, accion_id, descripcion });
            res.json(updatedLog);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO DELETE ===========================

    // Eliminación lógica de un log por ID
    async deleteLog(req, res, next) {
        const { id } = req.params;
        try {
            await logService.removeLog(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia del controlador
module.exports = new LogController();
