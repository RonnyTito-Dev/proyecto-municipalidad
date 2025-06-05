// services/documentService.js

// Importamos el modelo
const documentModel = require('../models/documentModel');

// Importamos el modelo de la solicitud
const requestModel = require('../models/requestModel');

// Importamos el validador de zod
const { schemaIdValidator, schemaURLValidator, schemaReqTrkCodeValidator, docuementCreateValidator } = require('../utils/validators');

// Importamos el manejo de errores
const ApiError = require('../errors/apiError');

class DocumentService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los documentos
    async getDocuments() {
        const documents = await documentModel.getAllDocuments();
        if (!documents || documents.length === 0) {
            throw ApiError.notFound('No hay documentos registrados');
        }
        return documents;
    }

    // Obtener documento por ID
    async getDocumentById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Documento').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const document = await documentModel.getDocumentById(id);
        if (!document) throw ApiError.notFound(`Documento con ID ${id} no encontrado`);

        return document;
    }

    // Obtener documento por URL
    async getDocumentByURL(rawUrl) {

        // Validar la URL
        const { data, error } = schemaURLValidator('Documento').safeParse(rawUrl);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar url
        const url = data;

        const document = await documentModel.getDocumentByURL(url);
        if (!document) throw ApiError.notFound(`Documento con URL "${url}" no encontrado`);

        return document;
    }

    // Obtener documentos por código de solicitud
    async getDocumentsByRequestCode(rawRequestCode) {

        // Validar codigo
        const { data, error } = schemaReqTrkCodeValidator('Solicitud').safeParse(rawRequestCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar codigo solicitud
        const codigo_solicitud = data;

        // Verificar si existe una solicitud con ese codigo
        const existingRequest = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequest) throw ApiError.notFound(`Solicitud con codigo "${codigo_solicitud}" no encontrada`);

        const documents = await documentModel.getDocumentsByRequestCode(codigo_solicitud);
        if (!documents || documents.length === 0) throw ApiError.notFound(`No se encontraron documentos para la solicitud "${codigo_solicitud}"`);

        return documents;
    }

    // Obtener documentos por tipo de documento
    async getDocumentsByDocumentType(rawDocumentTypeId) {

        // Validar el id del tipo de documento
        const { data, error } = schemaIdValidator('Tipo de Documento').safeParse(Number(rawDocumentTypeId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const tipo_documento_id = data;

        const documents = await documentModel.getDocumentsByDocumentType(tipo_documento_id);
        if (!documents || documents.length === 0) throw ApiError.notFound(`No se encontraron documentos para el tipo de documento con ID ${tipo_documento_id}`);
        
        return documents;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear nuevo documento
    async addDocument(rawData) {

        // Validar la data
        const { data, error } = docuementCreateValidator.safeParse(rawData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { codigo_solicitud, tipo_documento_id, url_documento } = data;

        // Verificar si existe una solicitud con ese codigo
        const existingRequest = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequest) throw ApiError.notFound(`Solicitud con codigo "${codigo_solicitud}" no encontrada`);

        // Verificar si ya existe documento con misma URL (único)
        const existing = await documentModel.getDocumentByURL(url_documento);
        if (existing) throw ApiError.conflict('Ya existe un documento con la misma URL');

        return await documentModel.createDocument({ codigo_solicitud, tipo_documento_id, url_documento });
    }

}

// Exportar una instancia del servicio
module.exports = new DocumentService();
