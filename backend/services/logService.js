// services/logService.js

// Importar el modelo
const logModel = require('../models/logModel');

// Importar el validador de Zod
const { logsCreateValidator  } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class LogService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los logs
    async getLogs() {
        const logs = await logModel.getAllLogs();
        if (!logs || logs.length === 0) {
            throw ApiError.notFound('No hay logs registrados');
        }
        return logs;
    }


    // ============================= MÉTODO POST ==============================

    // Crear un nuevo log
    async addLog(rawData) {

        // Validar data
        const { data, error } = logsCreateValidator.safeParse(rawData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar los datos
        const { usuario_id, area_id, tabla_afectada, accion_id, descripcion } = data;

        return await logModel.createLog({ usuario_id, area_id, tabla_afectada, accion_id, descripcion });
    }


}

// Exportar instancia del servicio
module.exports = new LogService();
