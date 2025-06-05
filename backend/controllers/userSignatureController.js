// controllers/userSignatureController.js

// Importar el servicio
const userSignatureService = require('../services/userSignatureService');

class UserSignatureController {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las firmas
    async getAllSignatures(req, res, next) {
        try {
            const firmas = await userSignatureService.getSignatures();
            res.json(firmas);
        } catch (error) {
            next(error);
        }
    }

    // Obtener todas las firmas activas
    async getActiveSignatures(req, res, next) {
        try {
            const firmas = await userSignatureService.getActiveSignatures();
            res.json(firmas);
        } catch (error) {
            next(error);
        }
    }

    // Obtener todas las firmas inactivas
    async getInactiveSignatures(req, res, next) {
        try {
            const firmas = await userSignatureService.getInactiveSignatures();
            res.json(firmas);
        } catch (error) {
            next(error);
        }
    }

    // Obtener firma por ID
    async getSignatureById(req, res, next) {
        try {
            const { id } = req.params;
            const firma = await userSignatureService.getSignatureById(id);
            res.json(firma);
        } catch (error) {
            next(error);
        }
    }

    // Obtener la firma activa del mismo usuario
    async getActiveSignatureByUserId(req, res, next) {
        try {
            const { usuario_id } = req.user;
            const firma = await userSignatureService.getActiveSignatureByUserId(usuario_id);
            res.json(firma);
        } catch (error) {
            next(error);
        }
    }

    // Obtener todas las firmas del mismo usuario
    async getAllSignaturesByUserId(req, res, next) {
        try {
            const { usuario_id } = req.user;
            const firmas = await userSignatureService.getSignaturesByUserId(usuario_id);
            res.json(firmas);
        } catch (error) {
            next(error);
        }
    }

    // ============================= MÉTODO POST ==============================

    // Crear nueva firma
    async createSignature(req, res, next) {
        try {
            const { usuario_id } = req.user;
            const { ruta_firma } = req.body;

            const firma = await userSignatureService.addSignature({ usuario_id, ruta_firma });
            res.status(201).json(firma);
        } catch (error) {
            next(error);
        }
    }

    // ============================= MÉTODO PUT ==============================

    // Activar una firma (y desactivar otras del mismo usuario)
    async activateSignature(req, res, next) {
        try {
            const { id } = req.params;
            const { usuario_id } = req.user;
            const firma = await userSignatureService.activateSignature(id, usuario_id);
            res.json(firma);
        } catch (error) {
            next(error);
        }
    }

    // Desactivar todas las firmas de un usuario
    async deactivateAllSignaturesByUserId(req, res, next) {
        try {
            const { usuario_id } = req.user;
            await userSignatureService.deactivateSignatures(usuario_id);
            res.status(204).send(); // No Content
        } catch (error) {
            next(error);
        }
    }

}

// Exportar una instancia
module.exports = new UserSignatureController();
