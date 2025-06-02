const { z } = require('zod');



const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());


const nameValidator = (label = 'nombre') => 
    z.string({ 
            required_error: `El nombre de ${label} es requerido`,
            invalid_type_error: `El nombre de ${label} debe ser un texto`
        })
     .trim()
     .min(3, { message: `El nombre de ${label} debe tener al menos 3 caracteres` })
     .max(50, { message: `El nombre de ${label} no debe superar los 50 caracteres` })
     .transform(val => toTitleCase(val));


// Schema DNI
const schemaDNI =
    z
        .string({
            required_error: `El DNI es requerido`,
            invalid_type_error: `El DNI debe ser de tipo texto`
        })
        .trim()
        .length(8, { message: `El DNI debe tener 8 caracteres` });


// Shema Request Code
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
        
const result = schemaURL('Imagen').safeParse('https://gemini.google.com/app/556e7aedbf6ed416?hl=es')


console.log(result);
if(result.data){
    console.log(result.data);
} else {
    console.log(result.error.errors[0].message);
}








