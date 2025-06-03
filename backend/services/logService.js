// services/logService.js

// Importar el modelo
const logModel = require('../models/logModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

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
    async addLog(data) {
        const { usuario_id, rol_id, area_id, tabla_afectada, accion_id } = data;

        if (!usuario_id || !rol_id || !area_id || !tabla_afectada || !accion_id || !descripcion) {
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


}

// Exportar instancia del servicio
module.exports = new LogService();
