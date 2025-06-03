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

    // Crear una nueva firma para un usuario
    async addSignature(data) {
        if (!data.usuario_id || isNaN(data.usuario_id) || Number(data.usuario_id) <= 0 || !Number.isInteger(Number(data.usuario_id))) {
            throw ApiError.badRequest('El ID del usuario es requerido y debe ser un número entero positivo');
        }

        if (!data.ruta_firma) {
            throw ApiError.badRequest('La ruta de la firma es requerida');
        }

        const rutaFirma = formatter.trim(data.ruta_firma);

        return await userSignatureModel.createSignature({
            usuario_id: Number(data.usuario_id),
            ruta_firma: rutaFirma,
        });
    }

}

// Exportar una instancia del servicio
module.exports = new UserSignatureService();
