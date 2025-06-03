// controllers/registerStatusController.js

// Importamos el servicio de estados de registro
const registerStatusService = require('../services/registerStatusService');

class RegisterStatusController {

    // ============================ MÉTODOS GET =============================

    // Obtener todos los estados de registro
    async getAllRegisterStatus(req, res, next) {
        try {
            const types = await registerStatusService.getAllRegisterStatus();
            res.json(types);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado de registro por ID
    async getRegisterStatusById(req, res, next) {
        const { id } = req.params;
        try {
            const registerStatus = await registerStatusService.getRegisterStatusById(id);
            res.json(registerStatus);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un estado de registro por nombre
    async getRegisterStatusByName(req, res, next) {
        const { nombre } = req.params;
        try {
            const registerStatus = await registerStatusService.getRegisterStatusByName(nombre);
            res.json(registerStatus);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO POST =============================

    // Crear un nuevo estado de registro
    async createRegisterStatus(req, res, next) {
        const { nombre, descripcion } = req.body;
        try {
            const newRegisterStatus = await registerStatusService.addRegisterStatus({ nombre, descripcion });
            res.status(201).json(newRegisterStatus);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO PUT ==============================

    // Actualizar estado de registro por ID
    async updateRegisterStatus(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            const updatedRegisterStatus = await registerStatusService.modifyRegisterStatus(id, { nombre, descripcion });
            res.json(updatedRegisterStatus);
        } catch (error) {
            next(error);
        }
    }

}

// Exportamos la instancia del controlador
module.exports = new RegisterStatusController();
