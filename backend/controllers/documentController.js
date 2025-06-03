// controllers/documentController.js

// Importamos el servicio
const documentService = require('../services/documentService');

class DocumentController {

    // ================================ MÉTODOS GET ================================

    // Obtener todos los documentos
    async getDocuments(req, res, next) {
        try {
            const documents = await documentService.getDocuments();
            res.json(documents);
        } catch (error) {
            next(error);
        }
    }

    // Obtener documento por ID
    async getDocumentById(req, res, next) {
        const { id } = req.params;

        try {
            const document = await documentService.getDocumentById(id);
            res.json(document);
        } catch (error) {
            next(error);
        }
    }

    // Obtener documento por URL (pasada en query ?url=...)
    async getDocumentByURL(req, res, next) {
        const { url } = req.query;

        try {
            const document = await documentService.getDocumentByURL(url);
            res.json(document);
        } catch (error) {
            next(error);
        }
    }

    // Obtener documentos por código de solicitud
    async getDocumentsByRequestCode(req, res, next) {
        const { codigoSolicitud } = req.params;

        try {
            const documents = await documentService.getDocumentsByRequestCode(codigoSolicitud);
            res.json(documents);
        } catch (error) {
            next(error);
        }
    }

    // Obtener documentos por tipo de documento
    async getDocumentsByDocumentType(req, res, next) {
        const { tipoDocumentoId } = req.params;

        try {
            const documents = await documentService.getDocumentsByDocumentType(tipoDocumentoId);
            res.json(documents);
        } catch (error) {
            next(error);
        }
    }

    // ================================ MÉTODO POST ================================

    // Crear nuevo documento
    async createDocument(req, res, next) {
        const data = req.body;

        try {
            const newDocument = await documentService.addDocument(data);
            res.status(201).json(newDocument);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos una instancia del controller
module.exports = new DocumentController();
