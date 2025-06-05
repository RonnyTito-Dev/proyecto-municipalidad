// Importamos axios
const axios = require('axios');

// Importamos el menejador de errores
const ApiError = require('../errors/apiError');

// Importamos configuracion de la api
const { api_config: { urlApi, tokenApi } } = require('../config/config');

// Importamos el validador de Zod
const { schemaDNIValidator } = require('../utils/validators');

class ReniecService {

    // Método para obtener datos de una persona por DNI
    async getReniecDataByDni(rawDni) {

        // Validar el DNI
        const { data, error } = schemaDNIValidator('la Persona').safeParse(rawDni);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar DNI
        const dni = data;

        try {
            
            const response = await axios.get(`${urlApi}${dni}`, {
                headers: {
                    Authorization: `Bearer ${tokenApi}`,
                    Accept: 'application/json'
                }
            });

            if (response.status === 200 && response.data) {
                return {
                    nombres: response.data.nombres,
                    apellido_paterno: response.data.apellidoPaterno,
                    apellido_materno: response.data.apellidoMaterno
                };
            } else {
                throw ApiError.notFound(`No se encontro informacion para el DNI ${dni}`);
            }

        } catch (error) {
            const mensaje = error.response?.data?.message || error.message;
            throw ApiError.internal(`Error al consultar RENIEC: ${mensaje}`);
        }
    }
}

// Exoportar una instancia del servicio
module.exports = new ReniecService();
