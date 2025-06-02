-- Tabla para estados generales de registros (1 Activo, 2 Eliminado)
CREATE TABLE estados_registro (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de acciones (Crear, Actualizar, Eliminar, Llamada a API)
CREATE TABLE acciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de roles de usuario
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de áreas municipales
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    area_publica BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de estados de usuario (Activo, Inactivo)
CREATE TABLE estados_usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de usuarios (trabajadores municipales)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(50) NOT NULL,         -- Title case + trim
    apellidos VARCHAR(50) NOT NULL,       -- Title case + trim
    dni VARCHAR(8) UNIQUE NOT NULL,       -- Upper Case + trim
    email VARCHAR(100) UNIQUE NOT NULL,  -- Lower Case + trim
    celular VARCHAR(9) UNIQUE NOT NULL, -- trim
    pin_seguridad VARCHAR(120) NOT NULL,             -- trim
    contrasenia VARCHAR(120) NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id),
    area_id INT NOT NULL REFERENCES areas(id),
    estado_usuario_id INT NOT NULL REFERENCES estados_usuario(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de firmas de los usuarios (trabajadores municipales)
CREATE TABLE firmas_usuarios (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) UNIQUE,
    ruta_firma VARCHAR(200) NOT NULL,             -- trim
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de canales de notificación (Email - WhatsApp)
CREATE TABLE canales_notificacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de estados de solicitud
CREATE TABLE estados_solicitud (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de canales de origen de la solicitud (Web - UTSD)
CREATE TABLE canales_solicitud (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de solicitudes ciudadanas
-- Código de solicitud (REQ-MUNI-YAU_134512_25042025_RO-TI)
-- Código de seguimiento (TRK-MUNI-YAU_134512_25042025_RO-TI)
CREATE TABLE solicitudes (
    id SERIAL,
    codigo_solicitud VARCHAR(50) PRIMARY KEY,        -- Upper Case + trim

    -- Datos del ciudadano
    nombres_ciudadano VARCHAR(50) NOT NULL,           -- Title case + trim
    apellidos_ciudadano VARCHAR(50) NOT NULL,         -- Title case + trim
    dni_ciudadano VARCHAR(8) NOT NULL,                 -- Upper case + trim
    direccion_ciudadano VARCHAR(150) NOT NULL,                  -- Title case + trim
    sector_ciudadano VARCHAR(100) NOT NULL,             -- Title case + trim
    email_ciudadano VARCHAR(100) NOT NULL,             -- Lower case + trim
    celular_ciudadano VARCHAR(9) NOT NULL,             -- trim

    -- Datos de la solicitud
    codigo_seguimiento VARCHAR(50) NOT NULL UNIQUE,     -- Upper case + trim
    area_sugerida_id INT NOT NULL REFERENCES areas(id),
    area_asignada_id INT REFERENCES areas(id),
    revision_manual BOOLEAN NOT NULL DEFAULT FALSE,
    asunto VARCHAR(200) NOT NULL,                        -- Title case + trim
    contenido TEXT NOT NULL,                             -- trim
    pin_seguridad VARCHAR(120) NOT NULL,                           -- trim
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Canal de contacto y origen
    canal_notificacion_id INT NOT NULL REFERENCES canales_notificacion(id),
    canal_solicitud_id INT NOT NULL REFERENCES canales_solicitud(id),

    -- Estado
    estado_solicitud_id INT NOT NULL DEFAULT 1 REFERENCES estados_solicitud(id),

    -- Flujo interno
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de adjuntos (imágenes o PDFs adicionales del ciudadano)
CREATE TABLE adjuntos (
    id SERIAL PRIMARY KEY,
    codigo_solicitud VARCHAR(50) REFERENCES solicitudes(codigo_solicitud), -- Upper Case + trim
    descripcion VARCHAR(200) NOT NULL,          -- trim
    url_archivo VARCHAR(200) NOT NULL UNIQUE,  -- trim
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tipos de documentos (Solicitud, Respuesta)
CREATE TABLE tipos_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,   -- Title case + trim
    descripcion VARCHAR(120),                    -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Documentos generados vinculados a una solicitud
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    codigo_solicitud VARCHAR(50) REFERENCES solicitudes(codigo_solicitud), -- Upper Case + trim
    tipo_documento_id INT REFERENCES tipos_documento(id),
    url_documento VARCHAR(200) NOT NULL UNIQUE,       -- trim
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Historial de cambios de estado de una solicitud
-- (Pendiente, Recibido, En Proceso, Derivado || Aprobado, Rechazado, Anulado || Finalizado)
CREATE TABLE historial_estados_solicitud (
    id SERIAL PRIMARY KEY,
    codigo_solicitud VARCHAR(50) REFERENCES solicitudes(codigo_solicitud), -- Upper case + trim
    estado_solicitud_id INT NOT NULL REFERENCES estados_solicitud(id),
    area_actual_id INT REFERENCES areas(id),
    area_destino_id INT REFERENCES areas(id),
    notas VARCHAR(150), -- trim
    usuario_id INT REFERENCES usuarios(id),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Notificaciones enviadas al ciudadano
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    codigo_solicitud VARCHAR(50) REFERENCES solicitudes(codigo_solicitud), -- Upper case + trim
    canal_notificacion_id INT NOT NULL REFERENCES canales_notificacion(id),
    mensaje VARCHAR(300) NOT NULL,                         -- trim
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);

-- Tabla de logs para registrar acciones en el sistema
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    rol_id INT REFERENCES roles(id),
    area_id INT REFERENCES areas(id),
    tabla_afectada VARCHAR(50) NOT NULL,         -- Lower case + trim
    accion_id INT NOT NULL REFERENCES acciones(id),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_registro_id INT NOT NULL DEFAULT 1 REFERENCES estados_registro(id)
);
