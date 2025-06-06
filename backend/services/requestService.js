// services/requestService.js

// Importar el modelo
const requestModel = require('../models/requestModel');

// Importar el validador de Zod
const { schemaIdValidator, schemaReqTrkCodeValidator, requestTrackingValidator, requestCreateValidator, updateRequestArea, updateRequestStatus, updateRequestAreaAndStatus } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

// Importar el generador de codigos
const codeGenerator = require('../utils/codeGenerator');

// Importar el hashPin
const { hashPin, comparePin } = require('../utils/bcryptHelper')

class RequestService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las solicitudes - superadmin - admin
    async getRequests() {
        const requests = await requestModel.getAllRequests();
        if (!requests || requests.length === 0) {
            throw ApiError.notFound('No hay solicitudes registradas');
        }
        return requests;
    }

    // Obtener solicitudes todas las solicitudes filtradas por area
    async getAllRequestsByArea(rawAreaId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Area').safeParse(Number(rawAreaId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar el id
        const area_id = data;

        const requests = await requestModel.getAllRequestsByArea(area_id);
        if (!requests || requests.length === 0) throw ApiError.notFound('No hay solicitudes registradas');

        return requests;
    }


    // Obtener una solicitud por código de solicitud - detallado
    async getRequestByRequestCode(rawRequestCode) {

        // Validar codigo solicitud
        const { data, error } = schemaReqTrkCodeValidator('Solicitud').safeParse(rawRequestCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar codigo seguimiento
        const codigo_solicitud = data;

        const request = await requestModel.getRequestByCode(codigo_solicitud);
        if (!request) throw ApiError.notFound(`Solicitud con código "${codigo_solicitud}" no encontrada`);

        return request;
    }


    // Obtener una solicitud por código de seguimiento - detallado
    async getRequestByTrackingCode(rawTrackingCode) {

        // Validar codigo seguiminto
        const { data, error } = schemaReqTrkCodeValidator('Seguimiento').safeParse(rawTrackingCode);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar codigo seguimiento
        const codigo_seguimiento = data;

        const request = await requestModel.getRequestByTrackingCode(codigo_seguimiento);
        if (!request) throw ApiError.notFound(`Solicitud con código de seguimiento "${codigo_seguimiento}" no encontrada`);

        return request;
    }


    // Obtener solicitud por código de seguimiento y PIN (acceso para ciudadano)
    async getRequestByTrackingCodeAndPin(rawData) {

        // Validar datos
        const { data, error } = requestTrackingValidator.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { codigo_seguimiento, pin_seguridad } = data;
        
        // Consultar solicitud
        const request = await requestModel.getRequestByTrackingCode(codigo_seguimiento);
        console.log(request);
        
        if (!request) throw ApiError.notFound('No se encontró ninguna solicitud con ese código de seguimiento');

        // Comparar pin
        const pinValido = await comparePin(pin_seguridad, request.pin_seguridad);

        if (!pinValido) throw ApiError.unauthorized('PIN de rastreo incorrecto. Verifique e intente de nuevo.');

        return request;
    }


    // ============================= MÉTODOS POST ==============================

    // Crear una nueva solicitud
    async addRequest(rawData) {

        // Formatear data
        const formatData = {
            nombres_ciudadano: rawData.nombres_ciudadano,
            apellidos_ciudadano: rawData.apellidos_ciudadano,
            dni_ciudadano: rawData.dni_ciudadano,
            direccion_ciudadano: rawData.direccion_ciudadano,
            sector_ciudadano: rawData.sector_ciudadano,
            email_ciudadano: rawData.email_ciudadano,
            celular_ciudadano: rawData.celular_ciudadano,
            area_sugerida_id: Number(rawData.area_sugerida_id),
            asunto: rawData.asunto,
            contenido: rawData.contenido,
            pin_seguridad: rawData.pin_seguridad,
            canal_notificacion_id: Number(rawData.canal_notificacion_id),
            canal_solicitud_id: rawData.usuario_id ? 2 : 1,
            usuario_id: rawData.usuario_id
        }

        // Validar datos
        const { data, error } = requestCreateValidator.safeParse(formatData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperamos datos
        const { nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, area_sugerida_id, asunto, contenido, pin_seguridad, canal_notificacion_id, canal_solicitud_id, usuario_id } = data;

        // Generar Codigos
        const { requestCode: codigo_solicitud, trackingCode: codigo_seguimiento } = codeGenerator.getRequestCodeAndTrackingCode(nombres_ciudadano, apellidos_ciudadano);

        // Hashear el pin
        const pin_seguridad_hash = await hashPin(pin_seguridad);

        // Validar que no exista código de solicitud duplicado
        const existingSolicitud = await requestModel.getRequestByCode(codigo_solicitud);
        if (existingSolicitud) throw ApiError.conflict(`La solicitud con este codigo ya está registrada, intentelo nuevamente`);

        // Validar que no exista código de seguimiento duplicado
        const existingSeguimiento = await requestModel.getRequestByTrackingCode(codigo_seguimiento);
        if (existingSeguimiento) throw ApiError.conflict(`La solicitud con código de seguimiento ya está registrada, intentelo nuevamente`);

        // Finalmente crear la solicitud
        return await requestModel.createRequest({ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, area_sugerida_id, asunto, contenido, pin_seguridad: pin_seguridad_hash, canal_notificacion_id, canal_solicitud_id, usuario_id });
    }


    // ============================= MÉTODOS PUT ==============================

    // Actualizar solo el estado de una solicitud
    async modifyRequestStatus(rawData) {

        // Validar data
        const { data, error } = updateRequestStatus.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar datos
        const { codigo_solicitud, estado_solicitud_id } = data;

        const request = await requestModel.getRequestByCode(codigo_solicitud);
        if (!request) throw ApiError.notFound(`Solicitud con código "${codigo_solicitud}" no encontrada`);

        return await requestModel.updateStatusRequest(codigo_solicitud, estado_solicitud_id);
    }


    // Actualizar la asignacion de un area
    async modifyRequestAsignArea(rawData) {

        // Validar data
        const { data, error } = updateRequestArea.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { codigo_solicitud, area_asignada_id } = data;

        const request = await requestModel.getRequestByCode(codigo_solicitud);
        if (!request) throw ApiError.notFound(`Solicitud con código "${codigo_solicitud}" no encontrada`);

        return await requestModel.updateAsignAreaRequest(codigo_solicitud, area_asignada_id);
    }

    // Actualizar asignar de un area y cambiar su estado de solicitud
    async modifyStatusAndAreaAsign(rawData) {

        // Validar data
        const { data, error } = updateRequestAreaAndStatus.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar datos
        const { codigo_solicitud, estado_solicitud_id, area_asignada_id } = data;

        const request = await requestModel.getRequestByCode(codigo_solicitud);
        if (!request) throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);

        return await requestModel.updateStatusAndAreaAsign(codigo_solicitud, estado_solicitud_id, area_asignada_id);
    }

}

// Exportar una instancia del servicio
module.exports = new RequestService();
