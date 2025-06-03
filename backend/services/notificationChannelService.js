// services/notificationChannelService.js

// Importar el modelo
const notificationChannelModel = require('../models/notificationChannelModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class NotificationChannelService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los canales
    async getChannels() {
        const channels = await notificationChannelModel.getAllChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de notificación registrados');
        }
        return channels;
    }

    // Obtener solo canales activos
    async getActiveChannels() {
        const channels = await notificationChannelModel.getActiveChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de notificación activos');
        }
        return channels;
    }

    // Obtener solo canales eliminados
    async getDeletedChannels() {
        const channels = await notificationChannelModel.getDeletedChannels();
        if (!channels || channels.length === 0) {
            throw ApiError.notFound('No hay canales de notificación eliminados');
        }
        return channels;
    }

    // Obtener canal por ID
    async getChannelById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        const channel = await notificationChannelModel.getChannelById(id);
        if (!channel) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }
        return channel;
    }

    // Obtener canal por nombre
    async getChannelByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del canal es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const channel = await notificationChannelModel.getChannelByName(nombreFormateado);

        if (!channel) {
            throw ApiError.notFound(`Canal con nombre "${nombreFormateado}" no encontrado`);
        }
        return channel;
    }

    // ============================= MÉTODO POST ==============================

    // Crear un nuevo canal
    async addChannel(data) {
        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del canal es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un canal con ese nombre
        const existing = await notificationChannelModel.getChannelByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El canal con nombre "${nombre}" ya está registrado`);
        }

        return await notificationChannelModel.createChannel({ nombre, descripcion });
    }

    // ============================= MÉTODO PUT ==============================

    // Actualizar un canal
    async modifyChannel(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        if (!data.nombre) {
            throw ApiError.badRequest('El nombre del canal es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el canal existe
        const existing = await notificationChannelModel.getChannelById(id);
        if (!existing) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre ya está en uso por otro canal
        const nombreDuplicado = await notificationChannelModel.getChannelByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) {
            throw ApiError.conflict(`El canal con nombre "${nombre}" ya está registrado por otro canal`);
        }

        return await notificationChannelModel.updateChannel(id, { nombre, descripcion });
    }

    // ============================= MÉTODO PATCH ==============================

    // Eliminacion Logica
    async removeChannel(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        const existing = await notificationChannelModel.getChannelById(id);
        if (!existing) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }

        await notificationChannelModel.deleteChannel(id);
    }

    // Restauracion Logica
    async restoreChannel(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del canal debe ser un número entero positivo');
        }

        const existing = await notificationChannelModel.getChannelById(id);
        if (!existing) {
            throw ApiError.notFound(`Canal con ID ${id} no encontrado`);
        }

        await notificationChannelModel.restoreChannel(id);
    }
}

// Exportar instancia del servicio
module.exports = new NotificationChannelService();