// Importamos axios
const axios = require('axios');

// Importamos el menejador de errores
const ApiError = require('../errors/apiError');

// Importamos configuracion de la api
const { api_config: { urlApi, tokenApi } } = require('../config/config');

class ReniecService {

    // Método para obtener datos de una persona por DNI
    async getReniecDataByDni(dni) {
        if (!dni || !/^\d{8}$/.test(dni)) {
            throw ApiError.badRequest('DNI invalido. Debe tener 8 digitos en numero');
        }

        try {
            console.log(`${urlApi}${dni}`);
            
            const response = await axios.get(`${urlApi}${dni}`, {
                headers: {
                    Authorization: `Bearer ${tokenApi}`,
                    Accept: 'application/json'
                }
            });

            if (response.status === 200 && response.data) {
                return {
                    nombres: response.data.nombres,
                    apellidoPaterno: response.data.apellidoPaterno,
                    apellidoMaterno: response.data.apellidoMaterno
                };
            } else {
                throw ApiError.notFound('No se encontro informacion para el DNI proporcionado');
            }

        } catch (error) {
            const mensaje = error.response?.data?.message || error.message;
            throw ApiError.internal(`Error al consultar RENIEC: ${mensaje}`);
        }
    }
}

// Exoportar una instancia del servicio
module.exports = new ReniecService();
