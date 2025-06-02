// services/documentService.js

// Importamos el modelo
const documentModel = require('../models/documentModel');

// Importamos el formatter
const formatter = require('../utils/textFormatter');

// Importamos el manejo de errores
const ApiError = require('../errors/apiError');

class DocumentService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los documentos (sin filtrar estado)
    async getDocuments() {
        const documents = await documentModel.getAllDocuments();
        if (!documents || documents.length === 0) {
            throw ApiError.notFound('No hay documentos registrados');
        }
        return documents;
    }

    // Obtener documentos activos (estado_registro_id = 1)
    async getActiveDocuments() {
        const documents = await documentModel.getActiveDocuments();
        if (!documents || documents.length === 0) {
            throw ApiError.notFound('No hay documentos activos registrados');
        }
        return documents;
    }

    // Obtener documentos eliminados (estado_registro_id = 2)
    async getDeletedDocuments() {
        const documents = await documentModel.getDeletedDocuments();
        if (!documents || documents.length === 0) {
            throw ApiError.notFound('No hay documentos eliminados registrados');
        }
        return documents;
    }

    // Obtener documento por ID
    async getDocumentById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del documento debe ser un número entero positivo');
        }
        const document = await documentModel.getDocumentById(id);
        if (!document) {
            throw ApiError.notFound(`Documento con ID ${id} no encontrado`);
        }
        return document;
    }

    // Obtener documento por URL
    async getDocumentByURL(url) {
        if (!url) {
            throw ApiError.badRequest('La URL del documento es requerida');
        }
        const urlFormatted = formatter.trim(url);
        const document = await documentModel.getDocumentByURL(urlFormatted);
        if (!document) {
            throw ApiError.notFound(`Documento con URL "${urlFormatted}" no encontrado`);
        }
        return document;
    }

    // Obtener documentos activos por código de solicitud
    async getDocumentsByRequestCode(codigoSolicitud) {
        if (!codigoSolicitud) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }
        const codigoFormatted = formatter.toUpperCase(codigoSolicitud);
        const documents = await documentModel.getDocumentsByRequestCode(codigoFormatted);
        if (!documents || documents.length === 0) {
            throw ApiError.notFound(`No se encontraron documentos para la solicitud "${codigoFormatted}"`);
        }
        return documents;
    }

    // Obtener documentos activos por tipo de documento
    async getDocumentsByDocumentType(tipoDocumentoId) {
        if (!tipoDocumentoId || isNaN(tipoDocumentoId) || !Number.isInteger(Number(tipoDocumentoId))) {
            throw ApiError.badRequest('El ID del tipo de documento debe ser un número entero válido');
        }
        const documents = await documentModel.getDocumentsByDocumentType(tipoDocumentoId);
        if (!documents || documents.length === 0) {
            throw ApiError.notFound(`No se encontraron documentos para el tipo de documento ID ${tipoDocumentoId}`);
        }
        return documents;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear nuevo documento
    async addDocument(data) {
        if (!data.codigo_solicitud) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }
        if (!data.tipo_documento_id || isNaN(data.tipo_documento_id) || !Number.isInteger(Number(data.tipo_documento_id))) {
            throw ApiError.badRequest('El ID del tipo de documento es requerido y debe ser un número entero válido');
        }
        if (!data.url_documento) {
            throw ApiError.badRequest('La URL del documento es requerida');
        }

        const codigoSolicitud = formatter.toUpperCase(data.codigo_solicitud);
        const tipoDocumentoId = Number(data.tipo_documento_id);
        const urlDocumento = formatter.trim(data.url_documento);

        // Verificar si ya existe documento con misma URL (único)
        const existing = await documentModel.getDocumentByURL(urlDocumento);
        if (existing) {
            throw ApiError.conflict('Ya existe un documento con la misma URL');
        }

        return await documentModel.createDocument({
            codigo_solicitud: codigoSolicitud,
            tipo_documento_id: tipoDocumentoId,
            url_documento: urlDocumento,
        });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar documento por ID
    async modifyDocument(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del documento debe ser un número entero positivo');
        }
        if (!data.codigo_solicitud) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }
        if (!data.tipo_documento_id || isNaN(data.tipo_documento_id) || !Number.isInteger(Number(data.tipo_documento_id))) {
            throw ApiError.badRequest('El ID del tipo de documento es requerido y debe ser un número entero válido');
        }
        if (!data.url_documento) {
            throw ApiError.badRequest('La URL del documento es requerida');
        }

        const codigoSolicitud = formatter.toUpperCase(data.codigo_solicitud);
        const tipoDocumentoId = Number(data.tipo_documento_id);
        const urlDocumento = formatter.trim(data.url_documento);

        const existing = await documentModel.getDocumentById(id);
        if (!existing) {
            throw ApiError.notFound(`Documento con ID ${id} no encontrado`);
        }

        if (
            codigoSolicitud === existing.codigo_solicitud &&
            tipoDocumentoId === existing.tipo_documento_id &&
            urlDocumento === existing.url_documento
        ) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si la URL ya está usada por otro documento distinto
        const urlDuplicada = await documentModel.getDocumentByURL(urlDocumento);
        if (urlDuplicada && urlDuplicada.id !== id) {
            throw ApiError.conflict('La URL del documento ya está en uso por otro registro');
        }

        return await documentModel.updateDocument(id, {
            codigo_solicitud: codigoSolicitud,
            tipo_documento_id: tipoDocumentoId,
            url_documento: urlDocumento,
        });
    }

    // ============================= MÉTODOS DELETE ==============================

    // Eliminación lógica (estado_registro_id = 2)
    async removeDocument(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del documento debe ser un número entero positivo');
        }

        const existing = await documentModel.getDocumentById(id);
        if (!existing) {
            throw ApiError.notFound(`Documento con ID ${id} no encontrado`);
        }

        await documentModel.deleteDocument(id);
    }
}

// Exportar una instancia del servicio
module.exports = new DocumentService();
