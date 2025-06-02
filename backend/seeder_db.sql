-- Estados generales del registro
INSERT INTO estados_registro (nombre, descripcion) VALUES
('Activo', 'Registro disponible y visible para el sistema'),
('Eliminado', 'Registro marcado como eliminado');


-- Acciones del sistema (para el log)
INSERT INTO acciones (nombre, descripcion) VALUES
('Creación', 'Registro creado por un usuario o sistema'),
('Actualización', 'Registro modificado por un usuario o sistema'),
('Eliminación', 'Registro eliminado por un usuario o sistema'),
('Consumo Api', 'Acción de lectura o consulta por medio de la API'),
('Inicio De Sesión', 'El usuario inició sesión en el sistema'),
('Cierre De Sesión', 'El usuario cerró sesión del sistema');


-- Roles de los usuarios
INSERT INTO roles (nombre, descripcion) VALUES
('Super Admin', 'Equipo responsable del mantenimiento, desarrollo y configuración del sistema (TI o devs)'),
('Administrador Municipal', 'Encargado designado por el municipio para gestionar el sistema, usuarios y datos a nivel general'),
('Jefe de Área', 'Funcionario que supervisa y coordina los trámites y actividades dentro de su área específica'),
('Colaborador de Área', 'Trabajador municipal que gestiona, elabora y da seguimiento a los trámites asignados en su área');


-- Áreas municipales que operan en el sistema
INSERT INTO areas (nombre, descripcion, area_publica) VALUES
('Super Administracion', 'Área para el equipo responsable del mantenimiento, desarrollo y configuración del sistema (TI o devs)', FALSE),
('Administración Municipal', 'Área encargada de la supervisión general del sistema y usuarios por parte del municipio', FALSE),
('Mesa de Partes', 'Recepción de documentos y trámites', TRUE),
('UTSD', 'Unidad de tramites y seguimiento documentario', TRUE),
('Licencias', 'Trámites para licencias de funcionamiento y anuncios', TRUE),
('Catastro', 'Registro y verificación de predios', TRUE),
('Obras Públicas', 'Ejecución y supervisión de obras municipales', TRUE),
('Desarrollo Urbano', 'Planeamiento urbano y gestión de habilitaciones', TRUE),
('Rentas', 'Gestión de tributos municipales y fiscalización', TRUE),
('Medio Ambiente', 'Protección ambiental y gestión de residuos', TRUE),
('Fiscalización', 'Control del cumplimiento de normativas locales', TRUE),
('Seguridad Ciudadana', 'Coordinación de seguridad y serenazgo', TRUE),
('Atención al Ciudadano', 'Recepción de quejas, sugerencias y orientación', TRUE);


-- Estados de usuario
INSERT INTO estados_usuario (nombre, descripcion) VALUES
('Habilitado', 'El usuario tiene acceso al sistema'),
('Inhabilitado', 'El usuario no tiene acceso al sistema');


-- Usuarios de ejemplo para cada área principal
INSERT INTO usuarios (nombres, apellidos, dni, email, celular, pin_seguridad, contrasenia, rol_id, area_id, estado_usuario_id)
VALUES
('Ronny', 'Tito', '74214623', 'ronny.tito@muni.gob.pe', '928001030', '$2b$10$GTiM.cux90yaAFqeW6fRgeTVGOjXxmRNUc/V07DQWxNIzuBbj89l2', '$2b$10$6J7Q4ZHuiVCY8745Bwz6OOzqkAJ0OX5z23rLuOO9bH/h2BBL4wZvy', 1, 1, 1),
('Pedro Jose', 'Lopez Gamarra', '87654321', 'pedro.lopez@muni.gob.pe', '912345678', '$2b$10$/P6kOcuBahbuL33pMzqiIuUnlVMgfthTg8LN/pfgRZb9rYENZamte', '$2b$10$KjK50MXm70IpDmswDbMUP.pe68uiuug/qIaXFllsLr6wr6S8.JSB2', 2, 2, 1);



-- Firmas digitales de los usuarios registrados
INSERT INTO firmas_usuarios (usuario_id, ruta_firma)
VALUES
(1, '/firmas/usuario_1.png'),
(2, '/firmas/usuario_2.png');



-- Canales de notificación
INSERT INTO canales_notificacion (nombre, descripcion) VALUES
('Email', 'Notificación por correo electrónico'),
('Whatsapp', 'Notificación por WhatsApp');


-- Estados de la solicitud
INSERT INTO estados_solicitud (nombre, descripcion) VALUES
('Pendiente', 'Recibido por el sistema, aún sin procesar'),
('Recepcionado', 'La solicitud ha sido leída o visualizada por el área, pero aún no se trabaja en ella.'),
('En Proceso', 'El área ha comenzado a trabajar en la solicitud.'),
('Derivado', 'La solicitud fue derivada a otra área para su atención.'),
('Aprobado', 'El trámite ha sido aceptado o autorizado por el área.'),
('Rechazado', 'El trámite ha sido denegado o no aprobado por el área.'),
('Anulado', 'El trámite fue invalidado o cancelado por alguna razón.'),
('Finalizado', 'El proceso o trámite ha concluido completamente.');


-- Canales por donde se registran las solicitudes
INSERT INTO canales_solicitud (nombre, descripcion) VALUES
('Web', 'Trámite ingresado desde el portal web'),
('UTSD', 'Trámite ingresado desde unidad de tramites y seguimiento documentario (presencial)');


-- Solitudes actuales
INSERT INTO solicitudes ( 
    codigo_solicitud, nombres_ciudadano, apellidos_ciudadano, dni_ciudadano,
    direccion_ciudadano, sector_ciudadano, email_ciudadano, celular_ciudadano,
    codigo_seguimiento, area_sugerida_id, asunto, contenido, pin_seguridad,
    canal_notificacion_id, canal_solicitud_id,
    estado_solicitud_id, usuario_id
) VALUES

('REQ-MUNI-YAU_134512_25042025_JU-GA', 'Julio', 'Gamboa Torres', '44122333',
 'Jr. Lima 123', 'Centro Poblado San Pedro', 'gamboajulio@gmail.com', '989123456',
 'TRK-MUNI-YAU_134512_25042025_JU-GA', 6, 'Solicitud De Constancia De Posesión', 'Deseo solicitar una constancia de posesión para mi predio ubicado en el Centro Poblado San Pedro. El terreno ha sido ocupado por mi familia durante más de 15 años de forma continua y pacífica. Esta constancia es necesaria para formalizar trámites ante notaría y SUNARP.', 
 '$2b$10$K8Po7YXQY6Bk1OlVaEAbKOcH0SfSnvW1Qej7dNVjBLNiJr3j7Z6Km',
 1, 1, 1, NULL);


-- Archivos adjuntos (PDFs o imágenes) relacionados a las solicitudes
INSERT INTO adjuntos (codigo_solicitud, descripcion, url_archivo)
VALUES
('REQ-MUNI-YAU_134512_25042025_JU-GA', 'Croquis del terreno solicitado', '/adjuntos/solicitud_1_croquis.jpg');


-- Tipos de documento (solicitud, respuesta) pdf
INSERT INTO tipos_documento (nombre, descripcion) VALUES
('Solicitud', 'Documento generado cuando el ciudadano registra un trámite'),
('Respuesta', 'Documento generado por el área municipal como respuesta al ciudadano');


-- Documentos PDF generados automáticamente al registrar la solicitud
INSERT INTO documentos (codigo_solicitud, tipo_documento_id, url_documento)
VALUES
('REQ-MUNI-YAU_134512_25042025_JU-GA', 1, '/documentos/solicitud_1_julio_gamboa.pdf');


-- Historial de estados de solicitud
-- Solicitud 1 (Julio Gamboa)
INSERT INTO historial_estados_solicitud (codigo_solicitud, estado_solicitud_id, area_actual_id, area_destino_id, notas, usuario_id) VALUES
('REQ-MUNI-YAU_134512_25042025_JU-GA', 1, null, null, null, null);


-- Notificaciones enviadas automáticamente al registrar las solicitudes
INSERT INTO notificaciones (codigo_solicitud, canal_notificacion_id, mensaje) VALUES
('REQ-MUNI-YAU_134512_25042025_JU-GA', 1, 'Estimado(a) JULIO GAMBOA TORRES, su solicitud con codigo REQ-MUNI-YAU_134512_25042025_JU-GA se encuentra en estado PENDIENTE. Puede rastrear el mismo con su código de seguimiento: TRK-MUNI-YAU_134512_25042025_JU-GA y su PIN.');

-- Agregar logs
INSERT INTO logs (usuario_id, rol_id, area_id, tabla_afectada, accion_id) VALUES
(1, 1, 1, 'Ninguno', 5),
(2, 2, 2, 'Ninguno', 5),
(2, 2, 2, 'Ninguno', 6);