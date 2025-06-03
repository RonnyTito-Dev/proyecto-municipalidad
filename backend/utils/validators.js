// utils/validators

// Importamos a zod
const { z } = require('zod');

// =================================== Title Case ===================================
const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());


// =================================== Esquemas de Validacion ===================================

// Esquema Id
const schemaId = (label = '[id]') =>
    z
        .number({
            required_error: `El ID de ${label} es requerido`,
            invalid_type_error: `El ID de ${label} debe ser numérico`
        })
        .int({ message: `El ID de ${label} debe ser un número entero` })
        .positive({ message: `El ID de ${label} debe ser un número positivo` });


// Esquema Nombre
const schemaName = (label = '[nombre]') =>
    z
        .string({
            required_error: `El nombre de ${label} es requerido`,
            invalid_type_error: `El nombre de ${label} debe ser un texto`
        })
        .trim()
        .min(3, { message: `El nombre de ${label} debe tener al menos 3 caracteres` })
        .max(50, { message: `El nombre de ${label} no debe superar los 50 caracteres` })
        .transform(val => toTitleCase(val));


// Schema Apellido
const schemaLastName = (label = '[apellido]') =>
    z
        .string({ required_error: `El apellido de ${label} es requerido` })
        .trim()
        .min(3, { message: `El apellido de ${label} debe tener al menos 3 caracteres` })
        .max(50, { message: `El apellido de ${label} no debe superar los 50 caracteres` })
        .transform(val => toTitleCase(val));


// Schema descripcion Optional
const schemaDescriptionOptional = (entity = '[Descripcion Opcional]')
    z
        .string()
        .trim()
        .max(120, { message: `La descripcion de ${entity} no debe superar los 120 caracteres` })


// Schema DNI
const schemaDNI = (entity = '[DNI]') =>
    z
        .string({
            required_error: `El DNI del ${entity} es requerido`,
            invalid_type_error: `El DNI debe ser de tipo texto`
        })
        .trim()
        .length(8, { message: `El DNI del ${entity} debe tener 8 caracteres` })
        .regex(/^\d+$/, { message: `El DNI del ${entity} solo debe contener números` });


// Schema Celular
const schemaPhone = (entity = '[celular]') =>
    z
        .string({
            required_error: `El celular del ${entity} es requerido`,
            invalid_type_error: `El celular del ${entity} debe ser de tipo texto`
        })
        .trim()
        .length(9, `El celular del ${entity} debe tener 8 caracteres`)
        .regex(/^\d+$/, { message: `El celular del ${entity} solo debe contener números` });


// Schema Email
const schemaEmail = (entity = '[email]') =>
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
const schemaPin = (entity = '[pin]') =>
    z
        .string({
            require_error: `El PIN del ${entity} es requerido`,
            invalid_type_error: `El PIN del ${entity} ser de tipo texto`
        })
        .trim()
        .length(8, { message: `El PIN del ${entity} debe tener 4 caracteres` })
        .regex(/^\d+$/, { message: `El PIN del ${entity} solo debe contener números` });

        
// Schema Password
const schemaPassword = (entity = '[contrasenia]') => 
    z
        .string({
            required_error: `La contraseña del ${entity} es requerida`,
            invalid_type_error: `La contraseña del ${entity} debe ser un texto`
        })
        .trim()
        .min(8, { message: `La contraseña del usuario ${entity} debe tener al menos 8 caracteres` });


// Schema Request and Tracking Code
const schemaReqTrkCode = (entity = '[REQ y TRK]') =>
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
const schemaAddress = (entity = '[direccion]') =>
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
const schemaSector = (entity = '[sector]') => 
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
const schemaBoolean = (entity = '[Boolean]')
        z.boolean({
                required_error: `El ${entity} es requerido`,
                invalid_type_error: `El ${entity} debe ser de tipo booleano`
        });

// Schema Asunt
const schemaAsunt = (entity = '[Asunto]') =>
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
const schemaContent = (entity = '[Contenido]') =>
    z
        .string({
            require_error: `El ${entity} es requerido`,
            invalid_type_error: `El ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(50, { message: `El ${entity} debe tener al menos 50 caracteres` });


// Schema description required adjunto
const schemaDescriptionReq = (entity = '[Descripcion Req]') => 
    z
        .string({
            required_error: `La descripcion de ${entity} es requerida`,
            invalid_type_error: `La descripcion de ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(20, { message: `La descripcion de ${entity} debe tener al menos 20 caracteres` })
        .max(200, { message: `La descripcion de ${entity} no debe superar los 200 caracteres` });


// Schama URL
const schemaURL = (entity = '[URL]') => 
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
const schemaNote = (entity = '[Nota]') => 
    z
        .string()
        .trim()
        .max(150, { message: `La Nota de ${entity} no debe superar los 150 caracteres` });



// Schema Message
const schemaMessage = (entity = '[Mensaje]') => 
    z
        .string({
            required_error: `El mensaje de ${entity} es requerido`,
            invalid_type_error: `El mensaje de ${entity} debe ser de tipo texto`
        })
        .trim()
        .min(20, { message: `El mensaje ${entity} debe contener al menos 20 caracteres` })
        .max(300, { message: `El mensaje ${entity} no debe superar los 150 caracteres` });
