// services/requestService.js

// Importar el modelo
const requestModel = require('../models/requestModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

// Importar el bcrypt helper
const { hashPin, comparePin } = require('../utils/bcryptHelper');

// Importar configuracion muni
const { muni_config: { muniRequestCode, muniTrackingCode } } = require('../config/config');

// Importar el dateHelper
const DTH = require('../utils/dateTimeHelper');

class RequestService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las solicitudes (sin importar estado)
    async getRequests() {
        const requests = await requestModel.getAllRequests();
        if (!requests || requests.length === 0) {
            throw ApiError.notFound('No hay solicitudes registradas');
        }
        return requests;
    }

    // Obtener solo solicitudes activas
    async getActiveRequests() {
        const requests = await requestModel.getActiveRequests();
        if (!requests || requests.length === 0) {
            throw ApiError.notFound('No hay solicitudes activas registradas');
        }
        return requests;
    }

    // Obtener solo solicitudes eliminadas
    async getDeletedRequests() {
        const requests = await requestModel.getDeletedRequests();
        if (!requests || requests.length === 0) {
            throw ApiError.notFound('No hay solicitudes eliminadas registradas');
        }
        return requests;
    }

    // Obtener una solicitud por código de solicitud
    async getRequestByCodigoSolicitud(codigo) {
        if (!codigo) {
            throw ApiError.badRequest('El código de solicitud es requerido');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const request = await requestModel.getRequestByCode(codigoFormateado);

        if (!request) {
            throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);
        }
        return request;
    }

    // Obtener una solicitud por código de seguimiento
    async getRequestByCodigoSeguimiento(codigo) {
        if (!codigo) {
            throw ApiError.badRequest('El código de seguimiento es requerido');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const request = await requestModel.getRequestByTrackingCode(codigoFormateado);

        if (!request) {
            throw ApiError.notFound(`Solicitud con código de seguimiento "${codigoFormateado}" no encontrada`);
        }
        return request;
    }

    // Obtener solicitud por código de seguimiento y PIN (acceso para ciudadano)
    async getRequestByTrackingCodeAndPin(codigo_seguimiento, pin) {
        // Validar código de seguimiento
        if (!codigo_seguimiento?.trim()) {
            throw ApiError.badRequest('El código de seguimiento es obligatorio');
        }

        const codigoFormateado = formatter.toUpperCase(codigo_seguimiento);

        // Validar PIN
        if (!pin?.trim()) {
            throw ApiError.badRequest('El PIN es obligatorio');
        }
        const pinFormateado = formatter.trim(pin);

        if (!/^\d{4}$/.test(pinFormateado)) {
            throw ApiError.badRequest('El PIN debe ser un string de 4 dígitos numéricos');
        }

        // Consultar solicitud
        const request = await requestModel.getRequestByTrackingCode(codigoFormateado);

        if (!request) {
            throw ApiError.notFound('No se encontró ninguna solicitud con ese código de seguimiento');
        }

        // Comparar pin
        const pinValido = await comparePin(pinFormateado, requestModel.pin);

        if (!pinValido) {
            throw ApiError.unauthorized('PIN incorrecto. Verifique e intente de nuevo.');
        }

        return request;
    }


    // ============================= MÉTODOS POST ==============================

    // Crear una nueva solicitud
    async addRequest(data) {

        // Validar nombres
        if (!data.nombres_ciudadano?.trim()) throw ApiError.badRequest('El nombre del ciudadano es obligatorio');

        // Validar apellidos
        if (!data.apellidos_ciudadano?.trim()) throw ApiError.badRequest('El apellido del ciudadano es obligatorio');

        // Validar DNI
        if (!data.dni_ciudadano?.trim()) throw ApiError.badRequest('El DNI del ciudadano es obligatorio');
        if (!/^\d{8}$/.test(data.dni_ciudadano.trim())) throw ApiError.badRequest('El DNI debe ser un string de 8 dígitos numéricos');

        // Validar direccion
        if (!data.direccion_ciudadano?.trim()) throw ApiError.badRequest('La dirección del ciudadano es obligatoria');

        // Validar sector
        if (!data.sector_ciudadano?.trim()) throw ApiError.badRequest('El sector del ciudadano es obligatorio');

        // Validar email
        if (!data.email_ciudadano?.trim()) throw ApiError.badRequest('El email del ciudadano es obligatorio');
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(data.email_ciudadano.trim())) throw ApiError.badRequest('El email debe tener un formato válido');

        // Validar celular
        if (!data.celular_ciudadano?.trim()) throw ApiError.badRequest('El celular del ciudadano es obligatorio');
        if (!/^\d{9}$/.test(data.celular_ciudadano.trim())) throw ApiError.badRequest('El celular debe ser un string de 9 dígitos numéricos');

        // Validar asunto
        if (!data.asunto?.trim()) throw ApiError.badRequest('El asunto es obligatorio');

        // Validar la solicitud (mensaje)
        if (!data.solicitud?.trim()) throw ApiError.badRequest('La solicitud o mensaje es obligatorio');

        // Validar que pin sea string de 4 dígitos numéricos
        if (!data.pin?.trim()) throw ApiError.badRequest('El PIN es obligatorio');
        if (typeof data.pin !== 'string' || !/^\d{4}$/.test(data.pin.trim())) {
            throw ApiError.badRequest('El PIN debe ser un string de 4 dígitos numéricos');
        }

        // Validar canal de notificacion
        if (data.canal_notificacion_id === undefined || data.canal_notificacion_id === null || !Number.isInteger(data.canal_notificacion_id) || data.canal_notificacion_id <= 0) {
            throw ApiError.badRequest('El canal de notificación es obligatorio y debe ser un número entero positivo');
        }

        // Crear datos saneados y formateados
        const nombres_ciudadano = formatter.toTitleCase(data.nombres_ciudadano);
        const apellidos_ciudadano = formatter.toTitleCase(data.apellidos_ciudadano);
        const dni_ciudadano = formatter.toUpperCase(data.dni_ciudadano);
        const direccion_ciudadano = formatter.toTitleCase(data.direccion_ciudadano);
        const sector_ciudadano = formatter.toTitleCase(data.sector_ciudadano);
        const email_ciudadano = formatter.toLowerCase(data.email_ciudadano);
        const celular_ciudadano = formatter.trim(data.celular_ciudadano);

        const asunto = formatter.toTitleCase(data.asunto);
        const solicitud = formatter.trim(data.solicitud);
        const pin = await hashPin(formatter.trim(data.pin)); // Hashear el pin
        const canal_notificacion_id = data.canal_notificacion_id;

        const canal_solicitud_id = data.id_usuario ? 2 : 1; // 2 = UTSD | 1 = Web
        const usuario_id = data.id_usuario ? data.id_usuario : null;  // Usuario quien registro 

        // Capturar el fecha y hora actual
        const fechaHoraCompacta = `${DTH.getCompactTime()}_${DTH.getCompactDate()}`;

        // Acortar los nombres
        const nombreApellidoRecortado = `${nombres_ciudadano.substring(0, 2).toUpperCase()}-${apellidos_ciudadano.substring(0, 2).toUpperCase()}`

        // Crear codigo de solicitud y seguimiento
        const codigo_solicitud = `${muniRequestCode}_${fechaHoraCompacta}_${nombreApellidoRecortado}`;
        const codigo_seguimiento = `${muniTrackingCode}_${fechaHoraCompacta}_${nombreApellidoRecortado}`;

        // Validar que no exista código de solicitud duplicado
        const existingSolicitud = await requestModel.getRequestByCode(codigo_solicitud);
        if (existingSolicitud) {
            throw ApiError.conflict(`La solicitud con este codigo ya está registrada, intentelo nuevamente`);
        }

        // Validar que no exista código de seguimiento duplicado
        const existingSeguimiento = await requestModel.getRequestByTrackingCode(codigo_seguimiento);
        if (existingSeguimiento) {
            throw ApiError.conflict(`La solicitud con código de seguimiento ya está registrada, intentelo nuevamente`);
        }

        // Finalmente crear la solicitud
        return await requestModel.createRequest({ codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, codigo_seguimiento, asunto, solicitud, pin, canal_notificacion_id, canal_solicitud_id, usuario_id });
    }


    // ============================= MÉTODOS PUT ==============================

    // Actualizar solo el estado de una solicitud
    async modifyRequestStatus(codigo, estado_solicitud_id) {
        if (!codigo) {
            throw ApiError.badRequest('Código de solicitud requerido');
        }
        if (!estado_solicitud_id || isNaN(estado_solicitud_id)) {
            throw ApiError.badRequest('Estado de solicitud inválido');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const request = await requestModel.getRequestByCode(codigoFormateado);

        if (!request) {
            throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);
        }

        return await requestModel.updateStatusRequest(codigoFormateado, estado_solicitud_id);
    }

    // Actualizar solo el área actual de una solicitud
    async modifyRequestArea(codigo, area_actual_id) {
        if (!codigo) {
            throw ApiError.badRequest('Código de solicitud requerido');
        }
        if (!area_actual_id || isNaN(area_actual_id)) {
            throw ApiError.badRequest('Área inválida');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const request = await requestModel.getRequestByCode(codigoFormateado);
        if (!request) {
            throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);
        }

        return await requestModel.updateAreaRequest(codigoFormateado, area_actual_id);
    }

    // Actualizar estado y área a la vez
    async modifyStatusAndArea(codigo, estado_solicitud_id, area_actual_id) {
        if (!codigo) {
            throw ApiError.badRequest('Código de solicitud requerido');
        }
        if (!estado_solicitud_id || isNaN(estado_solicitud_id)) {
            throw ApiError.badRequest('Estado inválido');
        }
        if (!area_actual_id || isNaN(area_actual_id)) {
            throw ApiError.badRequest('Área inválida');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const request = await requestModel.getRequestByCode(codigoFormateado);
        if (!request) {
            throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);
        }

        return await requestModel.updateStatusAndArea(codigoFormateado, estado_solicitud_id, area_actual_id);
    }




    // ============================= MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2
    async removeRequest(codigo) {
        if (!codigo) {
            throw ApiError.badRequest('El código de solicitud es requerido para eliminar');
        }

        const codigoFormateado = formatter.toUpperCase(codigo);
        const existing = await requestModel.getRequestByCodigoSolicitud(codigoFormateado);

        if (!existing) {
            throw ApiError.notFound(`Solicitud con código "${codigoFormateado}" no encontrada`);
        }

        await requestModel.deleteRequest(codigoFormateado);
    }
}

// Exportar una instancia del servicio
module.exports = new RequestService();
