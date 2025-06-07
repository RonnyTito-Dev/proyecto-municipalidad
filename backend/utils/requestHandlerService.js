// utils/requestHandlerService.js

// Importar los services
const requestService = require('../services/requestService');
const requestStatusHistoryService = require('../services/requestStatusHistoryService');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService.js');

// Constructor de mensajes
const { construirMensaje } = require('./requestMessageBuilder');

// Constante para IDs de estados
const ESTADOS = {
    PENDIENTE: 1,
    RECEPCIONADO: 2,
    EN_PROCESO: 3,
    DERIVADO: 4,
    APROBADO: 5,
    RECHAZADO: 6,
    ANULADO: 7
};


class RequestHandlerService {

    // =============================== CREAR SOLICITUD ===============================
    async creatingRequest(rawData) {
        
        // Insertar la solicitud a db
        const newRequest = await requestService.addRequest(rawData);

        // Obtener información detallada de la solicitud
        const requestData = await requestService.getRequestByRequestCode(newRequest.codigo_solicitud);

        // Extraer informacion necesaria
        const { codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Cambiar estado de solicitud a PENDIENTE
        await requestService.modifyRequestStatus({ codigo_solicitud, estado_solicitud_id: ESTADOS.PENDIENTE })

        // Construir la nota
        const notas = `La solicitud nueva ha sido asignada al Area ${area_asignada.toUpperCase()}`;

        // Registrar historial y notificar
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });

        // Retornar la solicitud
        return newRequest;
    }


    // =============================== ESTADO RECEPCIONADO ===============================
    async receiveRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a recepcionado
        await requestService.modifyRequestStatus({
            codigo_solicitud, estado_solicitud_id: ESTADOS.RECEPCIONADO
        });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas = rawData.notas?.trim() || `La solicitud ha sido recepcionada por el área ${area_asignada.toUpperCase()}`;

        // Registrar historial y notificar
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });
    }


    // =============================== ESTADO EN PROCESO ===============================
    async workOnRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a en proceso
        await requestService.modifyRequestStatus({ codigo_solicitud, estado_solicitud_id: ESTADOS.EN_PROCESO });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas = rawData.notas?.trim() || `El Area ${area_asignada.toUpperCase()} esta trabajando en la solicitud`;

        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });
    }


    // =============================== ESTADO DERIVADO ===============================
    async forwardRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, area_destino_id, usuario_id } = rawData;

        // Realizar consulta para obtener detalles - antes de
        const requestDataBack = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Obtener informacion necesaria
        const { area_asignada_id } = requestDataBack;

        // Actualizar estado y área asignada para derivar
        await requestService.modifyStatusAndAreaAsign({ codigo_solicitud, estado_solicitud_id: ESTADOS.DERIVADO,
            area_asignada_id: area_destino_id
        });

        // Realizar consulta para obtener detalles - despues de
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas =  rawData.notas?.trim() || `La Solicitud ha sido derivada al área ${area_asignada.toUpperCase()}`;

        // Registrar en el historial de solicitud
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, area_destino_id, notas, email_ciudadano });

        // Poner la solicitud en pendiente
        await this.pendingRequest(rawData)
    }


    // =============================== ESTADO APROBADO ===============================
    async approveRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a aprobado
        await requestService.modifyRequestStatus({
            codigo_solicitud, estado_solicitud_id: ESTADOS.APROBADO
        });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas = rawData.notas?.trim() || `La solicitud ha sido aprobada por el área ${area_asignada.toUpperCase()}`;

        // Registrar historial y notificar
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });

        // Finalizar la solicitud
        // await this.finallyRequest(rawData);
    }


    // =============================== ESTADO RECHAZADO ===============================
    async rejectRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a aprobado
        await requestService.modifyRequestStatus({
            codigo_solicitud, estado_solicitud_id: ESTADOS.RECHAZADO
        });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas = rawData.notas?.trim() || `La solicitud ha sido rechazada por el área ${area_asignada.toUpperCase()}`;

        // Registrar historial y notificar
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });

        // Finalizar la solicitud
        // await this.finallyRequest(rawData);
    }


    // =============================== ESTADO ANULADO ===============================
    async cancelRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a Anulado
        await requestService.modifyRequestStatus({ codigo_solicitud, estado_solicitud_id: ESTADOS.ANULADO });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas =  rawData.notas?.trim() || `La solicitud ha sido anulada por el ${area_asignada.toUpperCase()}`;

        // Registrar historial y notificar
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });

        // Finalizar la solicitud
        // await this.finallyRequest(rawData);
    }


    // =============================== ESTADO FINALIZADO (interno) ===============================
    async finallyRequest(rawData) {

        // Extraer informacion necesaria
        const { codigo_solicitud, usuario_id } = rawData;

        // Cambiar estado de la solicitud a FINALIZADO
        await requestService.modifyRequestStatus({
            codigo_solicitud, estado_solicitud_id: ESTADOS.FINALIZADO
        });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas = rawData.notas?.trim() || `La solicitud ha sido Finalizada por el área ${area_asignada.toUpperCase()}`;

        // Finalizar la solicitud
        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });
    }



    // =============================== ESTADO PENDIENTE ===============================
    async pendingRequest(rawData) {

        // Obtener datos necesario de la req
        const { codigo_solicitud } = rawData;

        // Cambiar el estaodo de la solicitud a pendiente
        await requestService.modifyRequestStatus({ codigo_solicitud, estado_solicitud_id: ESTADOS.PENDIENTE
        });

        // Realizar consulta para obtener detalles
        const requestData = await requestService.getRequestByRequestCode(codigo_solicitud);

        // Extraer informacion necesaria
        const { estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, email_ciudadano } = requestData;

        // Construir la nota
        const notas =  rawData.notas?.trim() || `La solicitud está en espera de ser atendida por el área ${area_asignada.toUpperCase()}`;

        await this.registrarHistorialYNotificar({ codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento, canal_notificacion_id, nombres_ciudadano, apellidos_ciudadano, area_asignada, notas, email_ciudadano });
    }


    // =============================== HISTORIAL Y NOTIFICACIÓN ===============================
    async registrarHistorialYNotificar(requestData) {

        // Extraer informacion necesaria
        const { codigo_solicitud, estado_solicitud_id, area_asignada_id, estado_solicitud, codigo_seguimiento,
            canal_notificacion_id, usuario_id = null, nombres_ciudadano, apellidos_ciudadano, area_asignada, area_destino_id = null, notas, email_ciudadano
        } = requestData;

        // 1. Registrar historial
        await requestStatusHistoryService.addStatusHistory({
            codigo_solicitud,
            estado_solicitud_id,
            area_actual_id: area_asignada_id,
            area_destino_id,
            notas,
            usuario_id
        });

        // 2. Crear mensaje de notificación
        const { subject, mensaje, html } = construirMensaje({
            nombres_ciudadano,
            apellidos_ciudadano,
            estado_solicitud,
            codigo_solicitud,
            codigo_seguimiento,
            area_asignada
        });

        // 3. Registrar notificación
        await notificationService.addNotification({
            codigo_solicitud,
            canal_notificacion_id,
            mensaje
        });

        // 4. Enviar el email
        await emailService.sendEmail({ to: email_ciudadano, subject, html });

    }

    // =============================== VERIFICADOR AUTOMÁTICO DE ESTADO FINAL ===============================
    async handleStateChange(requestData) {
        const estadosFinales = ['Aprobado', 'Rechazado', 'Anulado'];
        if (estadosFinales.includes(requestData.estado_solicitud)) {
            await this.finallyRequest(requestData);
        }
    }
}


// Exportar instancia
module.exports = new RequestHandlerService();
