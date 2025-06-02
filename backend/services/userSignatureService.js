// services/userSignatureService.js

// Importar el modelo
const userSignatureModel = require('../models/userSignatureModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class UserSignatureService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas
    async getAllSignatures() {
        const signatures = await userSignatureModel.getAllSignatures();
        if (!signatures || signatures.length === 0) {
            throw ApiError.notFound('No hay firmas de usuario registradas');
        }
        return signatures;
    }

    // Obtener solo firmas activas (estado_registro_id = 1)
    async getActiveSignatures() {
        const signatures = await userSignatureModel.getActiveSignatures();
        if (!signatures || signatures.length === 0) {
            throw ApiError.notFound('No hay firmas activas registradas');
        }
        return signatures;
    }

    // Obtener solo firmas eliminadas (estado_registro_id = 2)
    async getDeletedSignatures() {
        const signatures = await userSignatureModel.getDeletedSignatures();
        if (!signatures || signatures.length === 0) {
            throw ApiError.notFound('No hay firmas eliminadas registradas');
        }
        return signatures;
    }

    // Obtener una firma por ID
    async getSignatureById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID de la firma debe ser un número entero positivo');
        }

        const signature = await userSignatureModel.getSignatureById(id);
        if (!signature) {
            throw ApiError.notFound(`Firma con ID ${id} no encontrada`);
        }
        return signature;
    }

    // Obtener una firma por usuario_id
    async getSignatureByUserId(usuario_id) {
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const signature = await userSignatureModel.getSignatureByUserId(usuario_id);
        if (!signature) {
            throw ApiError.notFound(`Firma para el usuario con ID ${usuario_id} no encontrada`);
        }
        return signature;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear una nueva firma para un usuario (única por usuario)
    async addSignature(data) {
        if (!data.usuario_id || isNaN(data.usuario_id) || Number(data.usuario_id) <= 0 || !Number.isInteger(Number(data.usuario_id))) {
            throw ApiError.badRequest('El ID del usuario es requerido y debe ser un número entero positivo');
        }

        if (!data.ruta_firma) {
            throw ApiError.badRequest('La ruta de la firma es requerida');
        }

        // Verificar si el usuario ya tiene firma registrada
        const existing = await userSignatureModel.getSignatureByUserId(data.usuario_id);
        if (existing) {
            throw ApiError.conflict(`El usuario con ID ${data.usuario_id} ya tiene una firma registrada`);
        }

        const rutaFirma = formatter.trim(data.ruta_firma);

        return await userSignatureModel.createSignature({
            usuario_id: Number(data.usuario_id),
            ruta_firma: rutaFirma,
        });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar la ruta de la firma para un usuario
    async modifySignature(usuario_id, data) {
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        if (!data.ruta_firma) {
            throw ApiError.badRequest('La ruta de la firma es requerida');
        }

        // Verificar si la firma existe
        const existing = await userSignatureModel.getSignatureByUserId(usuario_id);
        if (!existing) {
            throw ApiError.notFound(`Firma para el usuario con ID ${usuario_id} no encontrada`);
        }

        const rutaFirma = formatter.trim(data.ruta_firma);

        // Validar si no hay cambios
        if (rutaFirma === existing.ruta_firma) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        return await userSignatureModel.updateSignature(usuario_id, rutaFirma);
    }

    // ============================ MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2 para marcar firma como eliminada
    async removeSignatureByUserId(usuario_id) {
        if (!usuario_id || isNaN(usuario_id) || Number(usuario_id) <= 0 || !Number.isInteger(Number(usuario_id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const existing = await userSignatureModel.getSignatureByUserId(usuario_id);
        if (!existing) {
            throw ApiError.notFound(`Firma para el usuario con ID ${usuario_id} no encontrada`);
        }

        await userSignatureModel.deleteSignatureByUserId(usuario_id);
    }
}

// Exportar una instancia del servicio
module.exports = new UserSignatureService();
