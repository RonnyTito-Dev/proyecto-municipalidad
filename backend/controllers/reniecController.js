// controllers/reniecController.js

// Importamos el ReniecService
const reniecService = require('../services/reniecService');

class ReniecController {

    // Método para obtener datos de persona por DNI
    async getDataByDni(req, res, next) {
        const { dni } = req.params;

        try {
            const personData = await reniecService.getReniecDataByDni(dni);
            res.json(personData);
        } catch (error) {
            next(error);
        }
    }
}

// Exportar una instancia del controller
module.exports = new ReniecController();
