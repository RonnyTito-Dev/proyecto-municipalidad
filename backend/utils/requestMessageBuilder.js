// requestMessageBuilder.js

// Importamos el formatter
const formatter = require('./textFormatter');

// Plantillas de mensaje por estado
const estadoMensajes = {
  'Pendiente': 'Su solicitud con código {codigo_solicitud} se encuentra en estado PENDIENTE. Actualmente está asignada al área de {area_asignada}. Puede rastrearla con su código de seguimiento y PIN.',
  'Recepcionado': 'Su solicitud con código {codigo_solicitud} ha sido RECEPCIONADA por el área de {area_asignada}. El área ya ha visualizado la solicitud.',
  'En Proceso': 'Su solicitud con código {codigo_solicitud} está siendo atendida por el área de {area_asignada}.',
  'Derivado': 'Su solicitud con código {codigo_solicitud} ha sido DERIVADA al área de {area_asignada} para su atención.',
  'Aprobado': 'Su solicitud con código {codigo_solicitud} ha sido APROBADA por el área de {area_asignada}. El trámite ha concluido satisfactoriamente.',
  'Rechazado': 'Su solicitud con código {codigo_solicitud} ha sido RECHAZADA por el área de {area_asignada}. El proceso ha finalizado debido a que no cumplió con los requisitos.',
  'Anulado': 'Su solicitud con código {codigo_solicitud} ha sido ANULADA. El proceso se dio por terminado por razones administrativas.'
};


// Constructor del mensaje
function construirMensaje({ nombres_ciudadano, apellidos_ciudadano, estado_solicitud, codigo_solicitud, 
    codigo_seguimiento, area_asignada }) {

    // Nombre completo del ciudadano
    const nombreCompleto = `${formatter.toTitleCase(nombres_ciudadano)} ${formatter.toTitleCase(apellidos_ciudadano)}`;

    // Url de seguimiento
    const baseURL = 'http://localhost:5173/';

    // Seleccionar plantilla a usar según estado
    const plantilla = estadoMensajes[estado_solicitud];
    if (!plantilla) throw new Error(`Estado no reconocido: ${estado_solicitud}`);

    // Reemplazamos placeholders por valores reales
    const cuerpo = plantilla
        .replace('{codigo_solicitud}', codigo_solicitud)
        .replace('{area_asignada}', (area_asignada?.toUpperCase() || 'ÁREA CORRESPONDIENTE'));

    // Mensaje en texto plano (igual que antes)
    const mensaje = `Estimado(a) ${nombreCompleto}, ${cuerpo}\n\n` +
                    `Código de seguimiento: ${codigo_seguimiento}\n` +
                    `Realice su seguimiento aquí: ${baseURL}`;

    // Asunto del correo
    const subject = `Actualización de su solicitud (${estado_solicitud.toUpperCase()})`;

    // Construcción del contenido HTML para el correo
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background: linear-gradient(145deg, #ffffff 0%, #f9fafe 100%); border-radius: 16px; box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(90deg, #7f9cf5 0%, #a78bfa 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Municipalidad de Yauyos</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">Gestión Digital de Trámites</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #2d3748; margin-top: 0; font-size: 21px;">Estimado/a ${nombreCompleto},</h2>

              <p style="font-size: 15px; line-height: 1.7; margin-bottom: 25px; color: #4a5568;">
                ${cuerpo}
              </p>

              <div style="background: linear-gradient(135deg, rgba(127, 156, 245, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%); border-radius: 10px; padding: 25px; margin: 30px 0; border: 1px solid #e0e7ff;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: #5a67d8; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 10px">Tu código único</p>
                <p style="margin: 0; font-size: 20px; font-family: 'Courier New', monospace; font-weight: bold; color: #3730a3; letter-spacing: 2px;">
                  ${codigo_seguimiento}
                </p>
              </div>

              <p style="font-size: 15px; line-height: 1.7; color: #4a5568; margin-bottom: 30px;">
                Para realizar el seguimiento de tu solicitud, haz clic en el siguiente botón:
              </p>

              <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(90deg, #7f9cf5 0%, #a78bfa 100%); box-shadow: 0 4px 12px rgba(127, 156, 245, 0.3);">
                    <a href="${baseURL}" target="_blank" style="font-size: 15px; color: white; text-decoration: none; padding: 16px 40px; display: inline-block; font-weight: 500; letter-spacing: 0.3px;">
                      Seguir mi trámite →
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background: rgba(247, 250, 255, 0.8); border-radius: 8px; padding: 16px; margin-top: 35px; border: 1px solid #e2e8f0;">
                <p style="font-size: 13px; color: #718096; margin: 0 0 6px 0;">¿Problemas con el botón?</p>
                <p style="font-size: 13px; color: #5a67d8; margin: 0; word-break: break-all; line-height: 1.5;">
                  Copia y pega esta URL en tu navegador:<br><br>
                  <span style="color: #3730a3;">${baseURL}</span>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background: linear-gradient(90deg, #edf2f7 0%, #e2e8f0 100%); padding: 20px; text-align: center; border-top: 1px solid #cbd5e0;">
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Municipalidad de Yauyos - Todos los derechos reservados
              </p>

            </td>
          </tr>
        </table>

        <p style="color: rgba(0,0,0,0.2); font-size: 11px; margin: 25px 0 0; text-align: center; letter-spacing: 0.5px;">
          Servicio Digital Moderno
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // Retornamos objeto con todos los datos para enviar el correo
    return { subject, mensaje, html };
}

// Exportar el constructor de mensajes
module.exports = {
    construirMensaje
};
