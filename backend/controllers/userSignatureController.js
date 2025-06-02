// controllers/userSignatureController.js

// Importamos el UserSignatureService
const userSignatureService = require('../services/userSignatureService');

class UserSignatureController {

    // ========================================== MÉTODOS GET ==========================================

    // Obtener todas las firmas (activas e inactivas)
    async getSignatures(req, res, next) {
        try {
            const signatures = await userSignatureService.getAllSignatures();
            res.json(signatures);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo firmas activas (estado_registro_id = 1)
    async getActiveSignatures(req, res, next) {
        try {
            const signatures = await userSignatureService.getActiveSignatures();
            res.json(signatures);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo firmas eliminadas (estado_registro_id = 2)
    async getDeletedSignatures(req, res, next) {
        try {
            const signatures = await userSignatureService.getDeletedSignatures();
            res.json(signatures);
        } catch (error) {
            next(error);
        }
    }

    // Obtener una firma por ID
    async getSignatureById(req, res, next) {
        const { id } = req.params;
        try {
            const signature = await userSignatureService.getSignatureById(id);
            res.json(signature);
        } catch (error) {
            next(error);
        }
    }

    // Obtener una firma por ID de usuario
    async getSignatureByUserId(req, res, next) {
        const { usuario_id } = req.params;
        try {
            const signature = await userSignatureService.getSignatureByUserId(usuario_id);
            res.json(signature);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Crear una nueva firma para un usuario (única por usuario)
    async createSignature(req, res, next) {
        try {
            const newSignature = await userSignatureService.addSignature(req.body);
            res.status(201).json(newSignature);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Actualizar la ruta de la firma de un usuario
    async updateSignature(req, res, next) {
        const { usuario_id } = req.params;
        try {
            const updatedSignature = await userSignatureService.modifySignature(usuario_id, req.body);
            res.json(updatedSignature);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO DELETE ==========================================

    // Eliminar una firma (eliminación lógica: estado_registro_id = 2)
    async deleteSignature(req, res, next) {
        const { usuario_id } = req.params;
        try {
            await userSignatureService.removeSignatureByUserId(usuario_id);
            res.sendStatus(204); // No Content
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new UserSignatureController();