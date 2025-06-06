// Importamos el formatter
const formatter = require('./textFormatter');

// Estados del mensaje
const estadoMensajes = {
  'Pendiente': 'su solicitud con código {codigo_solicitud} se encuentra en estado PENDIENTE. Puede rastrearla con su código de seguimiento y PIN.',
  'Recepcionado': 'su solicitud con código {codigo_solicitud} ha sido RECEPCIONADA. El área ya ha visualizado la solicitud.',
  'En Proceso': 'su solicitud con código {codigo_solicitud} está siendo atendida. El área ya está trabajando en su caso.',
  'Derivado': 'su solicitud con código {codigo_solicitud} ha sido DERIVADA a otra área correspondiente para su atención.',
  'Aprobado': 'su solicitud con código {codigo_solicitud} ha sido APROBADA. El trámite fue aceptado o autorizado.',
  'Rechazado': 'su solicitud con código {codigo_solicitud} ha sido RECHAZADA. No cumplió con los requisitos necesarios.',
  'Anulado': 'su solicitud con código {codigo_solicitud} fue ANULADA. El trámite ha sido cancelado por alguna razón.',
  'Finalizado': 'su solicitud con código {codigo_solicitud} ha sido FINALIZADA. El proceso concluyó correctamente.'
};

// Constructor del mensaje
function construirMensaje({ nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_solicitud, codigo_seguimiento }) {
  const nombreCompleto = `${formatter.toTitleCase(nombres_ciudadano)} ${formatter.toTitleCase(apellidos_ciudadano)}`;
  const baseURL = 'https://seguimiento.com/solicitudes/seguimiento';

  // Cuerpo del mensaje
  const cuerpo = estadoMensajes[estado_solicitud];

  if (!cuerpo) {
    throw new Error(`Estado no reconocido: ${estado_solicitud}`);
  }

  // Retornamos el mensaje
  return `Estimado(a) ${nombreCompleto}, ${cuerpo.replace('{codigo_solicitud}', codigo_solicitud)}\n\n` +
         `Código de seguimiento: ${codigo_seguimiento}\n` +
         `Realice su seguimiento aquí: ${baseURL}`;
}

// Exportamos el modulo
module.exports = {
  construirMensaje
};
