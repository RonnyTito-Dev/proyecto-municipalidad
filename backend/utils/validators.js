// utils/validators

// Importamos a zod
const { z } = require('zod');

// =================================== Title Case ===================================
const toTitleCase = (str) =>
    str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/(^|\s)\p{L}/gu, (char) => char.toUpperCase());

// =================================== Esquemas de Validacion ===================================

// Esquema Id
const schemaIdValidator = (entity = '[id]') =>
    z
        .number({
            required_error: `El ID de ${entity} es requerido`,
            invalid_type_error: `El ID de ${entity} debe ser numérico`
        })
        .int({ message: `El ID de ${entity} debe ser un número entero` })
        .positive({ message: `El ID de ${entity} debe ser un número positivo` });


// Validador que acepta null o un número entero positivo
const schemaNullableIdValidator = (entity = '[id]') =>
    z.union([
        z.literal(null),
        z.number({
            invalid_type_error: `El ID de ${entity} debe ser un número`,
            required_error: `El ID de ${entity} es requerido`
        })
            .int({ message: `El ID de ${entity} debe ser un número entero` })
            .positive({ message: `El ID de ${entity} debe ser un número positivo` }),
    ]);






// Esquema Nombre
const schemaFirstNameValidator = (entity = '[nombre]') =>
    z
        .string({
            required_error: `El nombre de ${entity} es requerido`,
            invalid_type_error: `El nombre de ${entity} debe ser un texto`
        })
        .trim()
        .min(3, { message: `El nombre de ${entity} debe tener al menos 3 caracteres` })
        .max(50, { message: `El nombre de ${entity} no debe superar los 50 caracteres` })
        .transform(val => toTitleCase(val));

// Esquema Nombres de tablas
const schemaNameValidator = (entity = '[nombre]') =>
    z
        .string({
            required_error: `El nombre de ${entity} es requerido`,
            invalid_type_error: `El nombre de ${entity} debe ser un texto`
        })
        .trim()
        .min(3, { message: `El nombre de ${entity} debe tener al menos 3 caracteres` })
        .max(50, { message: `El nombre de ${entity} no debe superar los 50 caracteres` })
        .transform(val => toTitleCase(val));


// Schema Apellido
const schemaLastNameValidator = (entity = '[apellido]') =>
    z
        .string({ required_error: `El apellido de ${entity} es requerido` })
        .trim()
        .min(3, { message: `El apellido de ${entity} debe tener al menos 3 caracteres` })
        .max(50, { message: `El apellido de ${entity} no debe superar los 50 caracteres` })
        .transform(val => toTitleCase(val));


// Schema descripcion Optional
const schemaDescriptionOptionalValidator = (entity = '[Descripcion Opcional]') =>
    z
        .string()
        .trim()
        .max(120, { message: `La descripcion de ${entity} no debe superar los 120 caracteres` })
        .or(z.literal(''))
        .optional();


// Schema DNI
const schemaDNIValidator = (entity = '[DNI]') =>
    z
        .string({
            required_error: `El DNI de ${entity} es requerido`,
            invalid_type_error: `El DNI debe ser de tipo texto`
        })
        .trim()
        .length(8, { message: `El DNI de ${entity} debe tener 8 caracteres` })
        .regex(/^\d+$/, { message: `El DNI de ${entity} solo debe contener números` });


// Schema Celular
const schemaPhoneValidator = (entity = '[celular]') =>
    z
        .string({
            required_error: `El celular del ${entity} es requerido`,
            invalid_type_error: `El celular del ${entity} debe ser de tipo texto`
        })
        .trim()
        .length(9, `El celular del ${entity} debe tener 9 caracteres`)
        .regex(/^\d+$/, { message: `El celular del ${entity} solo debe contener números` });


// Schema Email
const schemaEmailValidator = (entity = '[email]') =>
    z
        .string({
            required_error: `El email del ${entity} es que requerido`,
            invalid_type_error: `El email del ${entity} debe ser de tipo texto`
        })
        .trim()
        .email({ message: `El email del ${entity} debe tener un formato valido` })
        .max(100, { message: `El email del ${entity} no debe superar los 100 caracteres` })
        .toLowerCase();


// Schema PIN
const schemaPinValidator = (entity = '[pin]') =>
    z
        .string({
            require_error: `El PIN ${entity} es requerido`,
            invalid_type_error: `El PIN ${entity} ser de tipo texto`
        })
        .trim()
        .length(4, { message: `El PIN ${entity} debe tener 4 caracteres` })
        .regex(/^\d+$/, { message: `El PIN ${entity} solo debe contener números` });


// Schema Password
const schemaPasswordValidator = (entity = '[contrasenia]') =>
    z
        .string({
            required_error: `La contraseña del ${entity} es requerida`,
            invalid_type_error: `La contraseña del ${entity} debe ser un texto`
        })
        .trim()
        .min(8, { message: `La contraseña del ${entity} debe tener al menos 8 caracteres` });


// Schema Request and Tracking Code
const schemaReqTrkCodeValidator = (entity = '[REQ y TRK]') =>
    z
        .string({
            required_error: `El codigo de ${entity} es requerido`,
            invalid_type_error: `El codigo de ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(20, { message: `El codigo de ${entity} debe tener al menos 20 caracteres` })
        .max(50, { message: `El codigo de ${entity} no debe superar los 50 caracteres` })
        .toUpperCase();


// Schema address User
const schemaAddressValidator = (entity = '[direccion]') =>
    z
        .string({
            required_error: `La direccion del ${entity} es requerida`,
            invalid_type_error: `La direccion del ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(10, { message: `La direccion del ${entity} de tener al menos 10 caracteres` })
        .max(150, { message: `La direccion del ${entity} no debe superar los 150 caracteres` })
        .transform(val => toTitleCase(val));


// Scheam sector User
const schemaSectorValidator = (entity = '[sector]') =>
    z
        .string({
            required_error: `El sector del ${entity} es requerido`,
            invalid_type_error: `El sector del ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(6, { message: `El sector del ${entity} debe tener al menos 6 caracteres` })
        .max(100, { message: `El sector del ${entity} no debe superar los 100 caracteres` })
        .transform(val => toTitleCase(val));


// Schema booleano
const schemaBooleanValidator = (entity = '[Boolean]') =>
    z.boolean({
        required_error: `El ${entity} es requerido`,
        invalid_type_error: `El ${entity} debe ser de tipo booleano`
    });

// Schema Asunt
const schemaAsuntValidator = (entity = '[Asunto]') =>
    z
        .string({
            required_error: `El ${entity} es requerido`,
            invalid_type_error: `El ${entity} de ser de tipo texto`
        })
        .trim()
        .min(12, { message: `El ${entity} debe tener al menos 12 caracteres` })
        .max(200, { message: `El ${entity} no debe superar los 200 caracteres` })
        .transform(val => toTitleCase(val));

// Schema content
const schemaContentValidator = (entity = '[Contenido]') =>
    z
        .string({
            require_error: `El ${entity} es requerido`,
            invalid_type_error: `El ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(50, { message: `El ${entity} debe tener al menos 50 caracteres` });


// Schema description required adjunto
const schemaDescriptionReqValidator = (entity = '[Descripcion Req]') =>
    z
        .string({
            required_error: `La descripcion de ${entity} es requerida`,
            invalid_type_error: `La descripcion de ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(20, { message: `La descripcion de ${entity} debe tener al menos 20 caracteres` })
        .max(200, { message: `La descripcion de ${entity} no debe superar los 200 caracteres` });


// Schama URL
const schemaURLValidator = (entity = '[URL]') =>
    z
        .string({
            required_error: `La URL de ${entity} es requerida`,
            invalid_type_error: `La URL de ${entity} debe ser de tipo texto`
        })
        .trim()
        .url({ message: `La URL de ${entity} no es valida` })
        .min(10, { message: `La URL de ${entity} debe tener al menos 10 caracteres` })
        .max(200, { message: `La URL de ${entity} no debe superar los 200 caracteres` });


// Schema Notas
const schemaNoteValidator = (entity = '[Nota]') =>
    z
        .string()
        .trim()
        .max(150, { message: `La Nota de ${entity} no debe superar los 150 caracteres` });



// Schema Message
const schemaMessageValidator = (entity = '[Mensaje]') =>
    z
        .string({
            required_error: `El mensaje de ${entity} es requerido`,
            invalid_type_error: `El mensaje de ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(20, { message: `El mensaje ${entity} debe contener al menos 20 caracteres` })
        .max(500, { message: `El mensaje ${entity} no debe superar los 500 caracteres` });


// Schema tabla afectada Optional
const schemaAffectedTableValidator = (entity = '[Tabla afectada]') =>
    z
        .string()
        .trim()
        .max(50, { message: `La ${entity} no debe superar los 50 caracteres` })
        .or(z.literal(''))
        .optional();


// =================================== Objetos para validar ===================================

// Validador de login
const userLoginValidator = z.object({
    email: schemaEmailValidator('Usuario'),
    contrasenia: schemaPasswordValidator('Usuario'),
})




// Validador para acciones, roles, estados, usuarios, canales notificacion, estado_solicitud, tipos_documento
const simpleCreateValidator = (entity) => z.object({
    nombre: schemaNameValidator(entity),
    descripcion: schemaDescriptionOptionalValidator(entity),
});


// Validador para acciones, roles, estados, usuarios, canales notificacion, estado_solicitud, tipos_documento
const simpleUpdatedValidator = (entity) => z.object({
    id: schemaIdValidator(entity),
    nombre: schemaNameValidator(entity),
    descripcion: schemaDescriptionOptionalValidator(entity),
});

// Objeto de validacion para crear usuario
const userCreateValidador = z.object({
    nombres: schemaFirstNameValidator('Usuario'),
    apellidos: schemaLastNameValidator('Usuario'),
    dni: schemaDNIValidator('Usuario'),
    email: schemaEmailValidator('Usuario'),
    celular: schemaPhoneValidator('Usuario'),
    pin_seguridad: schemaPinValidator('Usuario'),
    contrasenia: schemaPasswordValidator('Usuario'),
    rol_id: schemaIdValidator('Rol'),
    area_id: schemaIdValidator('Area'),
    estado_usuario_id: schemaIdValidator('Estado de Usuario')
});

// Objeto de validacion para actualizar usuario
const userUpdatedValidador = z.object({
    id: schemaIdValidator('Usuario'),
    nombres: schemaFirstNameValidator('Usuario'),
    apellidos: schemaLastNameValidator('Usuario'),
    email: schemaEmailValidator('Usuario'),
    celular: schemaPhoneValidator('Usuario')
});

// Objeto de validacion para actualizar contrasenia de usuario
const userUpdatedPasswordValidador = z.object({
    id: schemaIdValidator('Usuario'),
    contrasenia_actual: schemaPasswordValidator('Actual'),
    contrasenia_nueva: schemaPasswordValidator('Nueva')
});

// Objeto de validacion para actualizar pin de usuario
const userUpdatedPinValidador = z.object({
    id: schemaIdValidator('Usuario'),
    pin_actual: schemaPinValidator('Actual'),
    pin_nuevo: schemaPinValidator('Nuevo')
});


// Validador para crear una solicitud
const requestCreateValidator = z.object({
    nombres_ciudadano: schemaFirstNameValidator('Ciudadano'),
    apellidos_ciudadano: schemaLastNameValidator('Ciudadano'),
    dni_ciudadano: schemaDNIValidator('Ciudadano'),
    direccion_ciudadano: schemaAddressValidator('Ciudadano'),
    sector_ciudadano: schemaSectorValidator('Ciudadano'),
    email_ciudadano: schemaEmailValidator('Ciudadano'),
    celular_ciudadano: schemaPhoneValidator('Ciudadano'),
    area_sugerida_id: schemaIdValidator('Area'),
    asunto: schemaAsuntValidator('Asunto'),
    contenido: schemaContentValidator('Contenido'),
    pin_seguridad: schemaPinValidator('de Seguimiento'),
    canal_notificacion_id: schemaIdValidator('Notificacion'),
    canal_solicitud_id: schemaIdValidator('Canal de Solicitud'),
    usuario_id: schemaNullableIdValidator('Usuario'),
});



// Validador para cambiar el area asignada
const updateRequestArea = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    area_asignada_id: schemaIdValidator('Area'),
});


// Validador para cambiar el estado de una solicitud
const updateRequestStatus = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    estado_solicitud_id: schemaIdValidator('Estado de solicitud'),
});


// Validador para cambiar el area asignada y es estado de solicitud
const updateRequestAreaAndStatus = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    estado_solicitud_id: schemaIdValidator('Estado de solicitud'),
    area_asignada_id: schemaIdValidator('Area'),
});


// Validador para crear un adjunto
const attachmentCreateValidator = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    descripcion: schemaDescriptionReqValidator('Archivo Adjunto'),
    url_archivo: schemaURLValidator('Archivo Adjunto')
});


// Validadot para crear, agregar un nuevo documento
const docuementCreateValidator = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    tipo_documento_id: schemaIdValidator('Tipo de Documento'),
    url_documento: schemaURLValidator('Documento'),
})


// Validador de tracking de solicitud
const requestTrackingValidator = z.object({
    codigo_seguimiento: schemaReqTrkCodeValidator('Seguimiento'),
    pin_seguridad:  schemaPinValidator('de Rastreo de Solicitud'),
})

// Validador para crear en historial de estados
const historyRequestCreatorValidator = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    estado_solicitud_id: schemaIdValidator('Estado de Solicitud'),
    area_actual_id: schemaNullableIdValidator('Area Actual'),
    area_destino_id: schemaNullableIdValidator('Area Destino'),
    notas: schemaNoteValidator('Historia'),
    usuario_id: schemaNullableIdValidator('Usuario'),
})


// Validador para crar notificaciones
const notificationCreatorValidator = z.object({
    codigo_solicitud: schemaReqTrkCodeValidator('Solicitud'),
    canal_notificacion_id: schemaIdValidator('Canal de Notificacion'),
    mensaje: schemaMessageValidator('Notificacion'),
});



// Validador para logs
const logsCreateValidator = z.object({
    usuario_id: schemaIdValidator('Usuario'),
    rol_id: schemaIdValidator('Rol'),
    area_id: schemaIdValidator('Area'),
    tabla_afectada: schemaAffectedTableValidator('Tabla Afectada'),
    accion_id: schemaIdValidator('Accion'), // obligatorio
});




// =================================== Exportar Validator ===================================
module.exports = {

    // Validadores sueltos
    schemaIdValidator,
    schemaNameValidator,
    schemaEmailValidator,
    schemaDNIValidator,
    schemaPhoneValidator,
    schemaBooleanValidator,
    schemaURLValidator,
    schemaReqTrkCodeValidator,


    // Objetos de validacion

    

    simpleCreateValidator,
    simpleUpdatedValidator,

    // Usuario
    userLoginValidator,
    userCreateValidador,
    userUpdatedValidador,
    userUpdatedPasswordValidador,
    userUpdatedPinValidador,

    // Solicitud
    requestCreateValidator,
    requestTrackingValidator,
    updateRequestArea,
    updateRequestStatus,
    updateRequestAreaAndStatus,

    // Adjuntos
    attachmentCreateValidator,

    // Documentos
    docuementCreateValidator,

    // Historial Solicitud
    historyRequestCreatorValidator,

    // Notificaciones
    notificationCreatorValidator,
    

    // Logs
    logsCreateValidator,
};