// services/userSignatureService.js

// Importar el modelo
const userSignatureModel = require('../models/userSignatureModel');

// Importar el validador de Zod
const { schemaIdValidator, schemaURLValidator } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class UserSignatureService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas 
    async getSignatures() {
        const firmas = await userSignatureModel.getAllSignatures();
        if (!firmas || firmas.length === 0) {
            throw ApiError.notFound('No hay firmas registradas');
        }
        return firmas;
    }

    // Obtener solo firmas activas
    async getActiveSignatures() {
        const firmas = await userSignatureModel.getActiveSignatures();
        if (!firmas || firmas.length === 0) {
            throw ApiError.notFound('No hay firmas activas registradas');
        }
        return firmas;
    }

    // Obtener solo firmas inactivas
    async getInactiveSignatures() {
        const firmas = await userSignatureModel.getInactiveSignatures();
        if (!firmas || firmas.length === 0) {
            throw ApiError.notFound('No hay firmas inactivas registradas');
        }
        return firmas;
    }

    // Obtener firma por ID
    async getSignatureById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('la Firma del Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const firma = await userSignatureModel.getSignatureById(id);
        if (!firma) throw ApiError.notFound(`Firma con ID ${id} no encontrada`);

        return firma;
    }

    // Obtener la firma activa del mismo usuario
    async getActiveSignatureByUserId(rawUserId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Usuario').safeParse(Number(rawUserId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const usuario_id = data;

        const firma = await userSignatureModel.getActiveSignatureByUserId(usuario_id);
        if (!firma) throw ApiError.notFound(`Usted no tiene una firma activa`);

        return firma;
    }

    // Obtener todas las firmas del mismo usuario
    async getSignaturesByUserId(rawUserId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Usuario').safeParse(Number(rawUserId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const usuario_id = data;

        const firmas = await userSignatureModel.getSignaturesByUserId(usuario_id);
        if (!firmas || firmas.length === 0)  throw ApiError.notFound(`Usted no tiene firmas registradas`);

        return firmas;
    }

    // ============================= MÉTODO POST ==============================

    // Agregar nueva firma
    async addSignature(rawData) {

        // Validar id
        const validatedId = schemaIdValidator('Usuario').safeParse(Number(rawData.usuario_id));
        if(validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        const validatedSignature = schemaURLValidator('la Firma').safeParse(rawData.ruta_firma);
        if(validatedSignature.error) throw ApiError.badRequest(validatedSignature.error.errors[0].message);

        // Recuperar datos
        const usuario_id = validatedId.data;
        const ruta_firma = validatedSignature.data;
        
        // Validar ruta de la firma
        const conflicSignature = await userSignatureModel.getSignatureByPath(ruta_firma);

        if(conflicSignature) throw ApiError.conflict('Ya existe una firma con esa ruta de firma');

        return await userSignatureModel.createSignature({ usuario_id, ruta_firma });
    }

    // ============================= MÉTODO PUT ==============================

    // Activar una firma y desactivar otras del mismo usuario
    async activateSignature(rawId, rawUserId) {
        
        // Validar los datos
        const validatedId = schemaIdValidator('la Firma').safeParse(Number(rawId));
        if(validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        const validatedUserId = schemaIdValidator('Usuario').safeParse(Number(rawUserId));
        if(validatedUserId.error) throw ApiError.badRequest(validatedUserId.error.errors[0].message);

        // Recuperar los datos
        const id = validatedId.data;
        const usuario_id = validatedUserId.data;

        // Verificar si existe la firma
        const existing = await userSignatureModel.getSignatureById(id);
        if (!existing) throw ApiError.notFound(`Firma con ID ${id} no encontrada`);
        
        return await userSignatureModel.activateSignature(id, usuario_id);
    }

    // Desactivar todas las firmas de un usuario
    async deactivateSignatures(rawUserId) {

        // Validar el id usuario
        const { data, error } = schemaIdValidator('Usuario').safeParse(Number(rawUserId));
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const usuario_id = data;

        const firmas = await userSignatureModel.getSignaturesByUserId(usuario_id);
        if (!firmas || firmas.length === 0) throw ApiError.notFound(`El usuario con ID ${usuario_id} no tiene firmas para desactivar`);

        await userSignatureModel.deactivateAllSignatures(usuario_id);
    }

}

// Exportar instancia del servicio
module.exports = new UserSignatureService();

