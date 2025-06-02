// attachmentController.js

// Importamos el AttachmentService
const attachmentService = require('../services/attachmentService');

class AttachmentController {

    // ========================================== MÉTODOS GET ==========================================

    // Método para obtener todos los archivos adjuntos
    async getAttachments(req, res, next) {
        try {
            const attachments = await attachmentService.getAttachments();
            res.json(attachments);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo archivos adjuntos activos
    async getActiveAttachments(req, res, next) {
        try {
            const attachments = await attachmentService.getActiveAttachments();
            res.json(attachments);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo archivos adjuntos eliminados
    async getDeletedAttachments(req, res, next) {
        try {
            const attachments = await attachmentService.getDeletedAttachments();
            res.json(attachments);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un archivo adjunto por ID
    async getAttachmentById(req, res, next) {
        const { id } = req.params;

        try {
            const attachment = await attachmentService.getAttachmentById(id);
            res.json(attachment);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un archivo adjunto por URL
    async getAttachmentByURL(req, res, next) {
        const { url } = req.params;

        try {
            const attachment = await attachmentService.getAttachmentByURL(url);
            res.json(attachment);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener archivos adjuntos por código de solicitud
    async getAttachmentsByRequestCode(req, res, next) {
        const { codigoSolicitud } = req.params;

        try {
            const attachments = await attachmentService.getAttachmentsByRequestCode(codigoSolicitud);
            res.json(attachments);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Método para agregar un nuevo archivo adjunto
    async createAttachment(req, res, next) {
        const { codigo_solicitud, descripcion, url_archivo } = req.body;

        try {
            const newAttachment = await attachmentService.addAttachment({ codigo_solicitud, descripcion, url_archivo });
            res.status(201).json(newAttachment);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO PUT ==========================================

    // Método para actualizar un archivo adjunto por ID
    async updateAttachment(req, res, next) {
        const { id } = req.params;
        const { descripcion, url_archivo } = req.body;

        try {
            const updatedAttachment = await attachmentService.modifyAttachment(id, { descripcion, url_archivo });
            res.json(updatedAttachment);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO DELETE ==========================================

    // Método para eliminar un archivo adjunto (eliminación lógica)
    async deleteAttachment(req, res, next) {
        const { id } = req.params;

        try {
            await attachmentService.removeAttachment(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new AttachmentController();
