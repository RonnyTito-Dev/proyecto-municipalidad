// services/attachmentService.js

// Importar el modelo adjuntos
const attachmentModel = require('../models/attachmentModel');

// Importar el modelo de solicitud
const requestModel = require('../models/requestModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

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
    async getAttachmentById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del archivo adjunto debe ser un número entero positivo');
        }

        const attachment = await attachmentModel.getAttachmentById(id);
        if (!attachment) {
            throw ApiError.notFound(`Archivo adjunto con ID ${id} no encontrado`);
        }
        return attachment;
    }

    // Obtener archivo adjunto por URL
    async getAttachmentByURL(url) {
        if (!url) {
            throw ApiError.badRequest('La URL del archivo adjunto es requerida');
        }

        const urlFormateada = formatter.trim(url);
        const attachment = await attachmentModel.getAttachmentByURL(urlFormateada);

        if (!attachment) {
            throw ApiError.notFound(`Archivo adjunto con URL "${urlFormateada}" no encontrado`);
        }
        return attachment;
    }

    // Obtener archivos adjuntos por código de solicitud
    async getAttachmentsByRequestCode(codigoSolicitud) {
        if (!codigoSolicitud) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }

        const codigoFormateado = formatter.toUpperCase(codigoSolicitud);
        const attachments = await attachmentModel.getAttachmentsByRequestCode(codigoFormateado);

        if (!attachments || attachments.length === 0) {
            throw ApiError.notFound(`No se encontraron archivos adjuntos para la solicitud "${codigoFormateado}"`);
        }
        return attachments;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo archivo adjunto
    async addAttachment(data) {
        if (!data.codigo_solicitud.trim()) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }
        if (!data.descripcion.trim()) {
            throw ApiError.badRequest('La descripción es requerida');
        }
        if (!data.url_archivo.trim()) {
            throw ApiError.badRequest('La URL del archivo es requerida');
        }

        const codigo_solicitud = formatter.toUpperCase(data.codigo_solicitud);
        const descripcion = formatter.trim(data.descripcion);
        const url_archivo = formatter.trim(data.url_archivo);

        // Verificar codigo de solicitud
        const existingRequestCode = await requestModel.getRequestByCode(codigo_solicitud);
        if(!existingRequestCode){
            throw ApiError.notFound('El codigo de solicitud no fue encontrado, y este es necesario')
        }

        // Verificar si ya existe un archivo con esa URL (único)
        const existing = await attachmentModel.getAttachmentByURL(url_archivo);
        if (existing) {
            throw ApiError.conflict('Ya existe un archivo adjunto con la misma URL');
        }

        return await attachmentModel.createAttachment({ codigo_solicitud, descripcion, url_archivo });
    }

}

// Exportar una instancia del servicio
module.exports = new AttachmentService();
