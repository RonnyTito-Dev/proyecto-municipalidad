// services/attachmentService.js

// Importar el modelo adjuntos
const attachmentModel = require('../models/attachmentModel');

// Importar el modelo de solicitud
const requestModel = require('../models/requestModel');

// Importar el validador de Zod
const {  schemaIdValidator, schemaURLValidator, schemaReqTrkCodeValidator, attachmentCreateValidator } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class AttachmentService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los archivos adjuntos
    async getAttachments() {
        const attachments = await attachmentModel.getAllAttachments();
        if (!attachments || attachments.length === 0) {
            throw ApiError.notFound('No hay archivos adjuntos registrados');
        }
        return attachments;
    }

    // Obtener archivo adjunto por ID
    async getAttachmentById(rowId) {

        // Validar Id
        const { data, error } = schemaIdValidator('Archivo Adjunto').safeParse(Number(rowId));
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const attachment = await attachmentModel.getAttachmentById(id);
        if (!attachment) throw ApiError.notFound(`Archivo adjunto con ID ${id} no encontrado`);
        
        return attachment;
    }

    // Obtener archivo adjunto por URL
    async getAttachmentByURL(rowUrl) {

        // Validar url
        const { data, error } = schemaURLValidator('Archivo Adjunto').safeParse(rowUrl);
        if(error) ApiError.badRequest(error.errors[0].message);

        // Recupera url
        const url = data;

        const attachment = await attachmentModel.getAttachmentByURL(url);
        if (!attachment) throw ApiError.notFound(`Archivo adjunto con URL "${url}" no encontrado`);
        
        return attachment;
    }

    // Obtener archivos adjuntos por código de solicitud
    async getAttachmentsByRequestCode(rawRequestCode) {

        // Validar codigo
        const { data, error } = schemaReqTrkCodeValidator('Solicitud').safeParse(rawRequestCode);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar codigo solicitud
        const codigo_solicitud = data;

        const attachments = await attachmentModel.getAttachmentsByRequestCode(codigo_solicitud);

        if (!attachments || attachments.length === 0)  throw ApiError.notFound(`No se encontraron archivos adjuntos para la solicitud "${codigo_solicitud}"`);
        
        return attachments;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo archivo adjunto
    async addAttachment(rawData) {

        // Validar la data
        const { data, error } = attachmentCreateValidator.safeParse(rawData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { codigo_solicitud, descripcion, url_archivo } = data;


        // Verificar codigo de solicitud
        const existingRequestCode = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequestCode) throw ApiError.notFound('El codigo de solicitud no fue encontrado, y este es necesario');

        // Verificar si ya existe un archivo con esa URL (único)
        const existing = await attachmentModel.getAttachmentByURL(url_archivo);
        if (existing) throw ApiError.conflict('Ya existe un archivo adjunto con la misma URL');

        return await attachmentModel.createAttachment({ codigo_solicitud, descripcion, url_archivo });
    }

}

// Exportar una instancia del servicio
module.exports = new AttachmentService();
