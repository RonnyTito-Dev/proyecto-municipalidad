// services/registerStatusService.js

// Importamos el modelo
const registerStatusModel = require('../models/registerStatusModel');

// Importamos el formatter
const formatter = require('../utils/textFormatter');

// Importamos el manejo de errores
const ApiError = require('../errors/apiError');

class RegisterStatusService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los registros
    async getAllRegisterStatus() {
        const registerStatus = await registerStatusModel.getAllRegisterStatus();
        if (!registerStatus || registerStatus.length === 0) {
            throw ApiError.notFound('No hay estados de registro registrados');
        }
        return registerStatus;
    }


    // Obtener estado de registro por ID
    async getRegisterStatusById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado de registro debe ser un número entero positivo');
        }
        const registerStatus = await registerStatusModel.getRegisterStatusById(id);
        if (!registerStatus) {
            throw ApiError.notFound(`Estado de registro con ID ${id} no encontrado`);
        }
        return registerStatus;
    }

    // Obtener un estado de registro por nombre
    async getRegisterStatusByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del estado de registro es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const registerStatus = await registerStatusModel.getRegisterStatusByName(nombreFormateado);

        if (!registerStatus) {
            throw ApiError.notFound(`Estado de registro con nombre "${nombreFormateado}" no encontrado`);
        }
        return registerStatus;
    }



    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo estado de registro
    async addRegisterStatus(data) {
        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado de registro es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un tipo con ese nombre
        const existing = await registerStatusModel.getRegisterStatusByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El estado de registro con nombre "${nombre}" ya está registrado`);
        }

        return await registerStatusModel.createRegisterStatus({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un estado de registro por ID
    async modifyRegisterStatus(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del estado de registro debe ser un número entero positivo');
        }

        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del estado de registro es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el tipo de documento existe
        const existing = await registerStatusModel.getRegisterStatusById(id);
        if (!existing) {
            throw ApiError.notFound(`Estado de registro con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro tipo
        const nombreDuplicado = await registerStatusModel.getRegisterStatusByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) {
            throw ApiError.conflict(`Estado de registro con nombre "${nombre}" ya está registrado por otro estado`);
        }

        return await registerStatusModel.updateRegisterStatus(id, { nombre, descripcion });
    }

}

// Exportar una instancia del servicio
module.exports = new RegisterStatusService();
