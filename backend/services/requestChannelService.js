// services/requestChannelService.js

// Importar el modelo
const requestChannelModel = require('../models/requestChannelModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class RequestChannelService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los canales de solicitud
    async getRequestChannels() {
        const channels = await requestChannelModel.getAllRequestChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de solicitud registrados');
        }
        return channels;
    }

    // Obtener solo canales activos
    async getActiveRequestChannels() {
        const channels = await requestChannelModel.getActiveRequestChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de solicitud activos registrados');
        }
        return channels;
    }

    // Obtener solo canales eliminados
    async getDeletedRequestChannels() {
        const channels = await requestChannelModel.getDeletedRequestChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de solicitud eliminados registrados');
        }
        return channels;
    }

    // Obtener un canal por ID
    async getRequestChannelById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        const channel = await requestChannelModel.getRequestChannelById(id);
        if (!channel) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }
        return channel;
    }

    // Obtener un canal por nombre
    async getRequestChannelByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del canal de solicitud es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const channel = await requestChannelModel.getRequestChannelByName(nombreFormateado);

        if (!channel) {
            throw ApiError.notFound(`Canal con nombre "${nombreFormateado}" no encontrado`);
        }
        return channel;
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo canal
    async addRequestChannel(data) {
        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del canal de solicitud es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        const existing = await requestChannelModel.getRequestChannelByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El canal con nombre "${nombre}" ya está registrado`);
        }

        return await requestChannelModel.createRequestChannel({ nombre, descripcion });
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un canal
    async modifyRequestChannel(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del canal de solicitud es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        const existing = await requestChannelModel.getRequestChannelById(id);
        if (!existing) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }

        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        const nombreDuplicado = await requestChannelModel.getRequestChannelByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) {
            throw ApiError.conflict(`El canal con nombre "${nombre}" ya está registrado por otro canal`);
        }

        return await requestChannelModel.updateRequestChannel(id, { nombre, descripcion });
    }

    // ============================= MÉTODO DELETE ==============================

    // Eliminación lógica
    async removeRequestChannel(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        const existing = await requestChannelModel.getRequestChannelById(id);
        if (!existing) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }

        await requestChannelModel.deleteRequestChannel(id);
    }
}

// Exportar una instancia del servicio
module.exports = new RequestChannelService();
