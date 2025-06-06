
// utils/requestHandler.js

// Importamos el contructor de mensajes
const { construirMensaje } = require('./requestMessageBuilder');

// Importar el service de Solicitud
const requestService = require('../services/requestService');

// Importar el service de historial de estados de solicitud
const requestStatusHistoryService = require('../services/requestStatusHistoryService');

// Importar el service de notificaciones
const notificationService = require('../services/notificationService');

// [ codigo_solicitud, estado_solicitud_id, area_asignada_id, area_actual_id, area_destino_id, notas, usuario_id, nombres_ciudadano, _apellidos_ciudadano, estado_solicitud, codigo_seguimiento, canal_notificacion_id, mensaje ]

class RequestHandlerService {

    // Lógica para manejar una nueva solicitud
    async creatingRequest(rawData) {

        // 1. Crear la solicitud
        // [ nombres_ciudadano, apellidos_ciudadano, dni_ciudadano, direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano, area_sugerida_id, asunto, contenido, pin_seguridad, canal_notificacion_id, canal_solicitud_id, usuario_id ]
        const newRequest = await requestService.addRequest(rawData);


        // 2. Obtener informacion detallada
        const { codigo_solicitud, estado_solicitud_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_seguimiento, canal_notificacion_id  } = await requestService.getRequestByRequestCode(newRequest.codigo_solicitud);

        const area_actual_id = null;
        const area_destino_id = null;
        
        const notas = 'Soliicud creada correctamente';

        console.log(codigo_solicitud, estado_solicitud_id, usuario_id, nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_seguimiento, canal_notificacion_id);
        

        // 3. Registrar en Historial de Solicitud 
        // [ codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id ] 
        const newRequestStatusHistory = await requestStatusHistoryService.addStatusHistory({ codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id });

        // 4. Constructor de mensaje 
        // [nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_solicitud, codigo_seguimiento ]
        const newMessage = construirMensaje({ nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_solicitud, codigo_seguimiento });

        // 5. Mandar notificacion 
        // [ codigo_solicitud, canal_notificacion_id, mensaje ]
        const newNotification = notificationService.addNotification({ codigo_solicitud, canal_notificacion_id, mensaje });

        return newRequest;

    }

    // Lógica para manejar el estado "Pendiente"
    async pendingRequest() {

        // 1. Actualizar Solicitud (Estado de solucitud y area) 
        // [ codigo_solicitud, estado_solicitud_id, area_asignada_id]


        // 2. Registrar en Historial de Solicitud 
        // [ codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id ] 


        // 3. Constructor de mensaje 
        // [nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_solicitud, codigo_seguimiento ]

        // 3. Mandar notificacion 
        // [ codigo_solicitud, canal_notificacion_id, mensaje ]



    }

    // Lógica para manejar el estado "Recepcionado"
    async receiveRequest() {

    }

    // Lógica para manejar el estado "En Proceso"
    async workOnRequest() {

    }

    // Lógica para manejar el estado "Derivado"
    async forwardRequest() {

    }

    // Lógica para manejar el estado "Aprobado"
    async approveRequest() {

    }

    // Lógica para manejar el estado "Rechazado"
    async rejectRequest() {

    }

    // Lógica para manejar el estado "Anulado"
    async cancelRequest() {

    }

    // Lógica para manejar el estado "Finalizado"
    async finallyRequest() {

    }

}

// Exportar una instancia de la clase
module.exports = new RequestHandlerService();
