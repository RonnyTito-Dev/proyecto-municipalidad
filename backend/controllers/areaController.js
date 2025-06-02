// areaController.js

// Importamos el AreaService
const areaService = require('../services/areaService');

class AreaController {

    // ========================================== METODOS GET ==========================================

    // Método para obtener todas las áreas (sin importar estado)
    async getAreas(req, res, next) {
        try {
            const areas = await areaService.getAreas();
            res.json(areas);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo las áreas activas
    async getActiveAreas(req, res, next) {
        try {
            const areas = await areaService.getActiveAreas();
            res.json(areas);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo las áreas eliminadas
    async getDeletedAreas(req, res, next) {
        try {
            const areas = await areaService.getDeletedAreas();
            res.json(areas);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un área por ID
    async getAreaById(req, res, next) {
        const { id } = req.params;

        try {
            const area = await areaService.getAreaById(id);
            res.json(area);

        } catch (error) {
            next(error);
        }
    }

    // Método para obtener un área por nombre
    async getAreaByName(req, res, next) {
        const { nombre } = req.params;

        try {
            const area = await areaService.getAreaByName(nombre);
            res.json(area);

        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO POST ==========================================

    // Método para agregar una nueva área
    async createArea(req, res, next) {
        const { nombre, descripcion } = req.body;

        try {
            const newArea = await areaService.addArea({ nombre, descripcion });
            res.status(201).json(newArea);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO PUT ==========================================

    // Método para actualizar un área
    async updateArea(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            const updatedArea = await areaService.modifyArea(id, { nombre, descripcion });
            res.json(updatedArea);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO DELETE ==========================================

    // Método para eliminar un área (eliminación lógica)
    async deleteArea(req, res, next) {
        const { id } = req.params;

        try {
            await areaService.removeArea(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new AreaController();
