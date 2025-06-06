// controllers/logController.js

// Importamos el servicio de logs
const logService = require('../services/logService');

class LogController {

    // ============================ MÉTODOS GET =============================

    // Obtener todos los logs
    async getLogs(req, res, next) {
        try {
            const logs = await logService.getLogs();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO POST =============================

    // Crear un nuevo log
    async createLog(req, res, next) {
        const { tabla_afectada, accion_id } = req.body;
        const { usuario_id, rol_id, area_id } = req.user;


        try {
            const newLog = await logService.addLog({ usuario_id, rol_id, area_id, tabla_afectada, accion_id });
            res.status(201).json(newLog);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos la instancia del controlador
module.exports = new LogController();
