// areaService.js

// Importar el modelo
const areaModel = require('../models/areaModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

// Importar los errores
const ApiError = require('../errors/apiError');

class AreaService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las áreas (sin importar estado)
    async getAreas() {
        const areas = await areaModel.getAllAreas();
        if (!areas || areas.length === 0) {
            throw ApiError.notFound('No hay áreas registradas');
        }
        return areas;
    }

    // Obtener solo áreas activas
    async getActiveAreas() {
        const areas = await areaModel.getActiveAreas();
        if (!areas || areas.length === 0) {
            throw ApiError.notFound('No hay áreas activas registradas');
        }
        return areas;
    }

    // Obtener solo áreas eliminadas
    async getDeletedAreas() {
        const areas = await areaModel.getDeletedAreas();
        if (!areas || areas.length === 0) {
            throw ApiError.notFound('No hay áreas eliminadas registradas');
        }
        return areas;
    }

    // Obtener un área por ID
    async getAreaById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }

        const area = await areaModel.getAreaById(id);
        if (!area) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }
        return area;
    }

    // Obtener un área por nombre
    async getAreaByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre del área es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const area = await areaModel.getAreaByName(nombreFormateado);

        if (!area) {
            throw ApiError.notFound(`Área con nombre "${nombreFormateado}" no encontrado`);
        }
        return area;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear una nueva área
    async addArea(data) {
        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre del área es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe un área con ese nombre
        const existing = await areaModel.getAreaByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El área con nombre "${nombre}" ya está registrado`);
        }

        return await areaModel.createArea({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un área
    async modifyArea(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }

        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre del área es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si el área existe
        const existing = await areaModel.getAreaById(id);
        if (!existing) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otra área
        const nombreDuplicado = await areaModel.getAreaByName(nombre);
        if (nombreDuplicado && Number(nombreDuplicado.id) !== Number(id)) {
            throw ApiError.conflict(`El área con nombre "${nombre}" ya está registrado por otro área`);
        }

        return await areaModel.updateArea(id, { nombre, descripcion });
    }

    // ============================= MÉTODOS DELETE ==============================

    // Eliminado lógico: actualizar estado_registro_id a 2
    async removeArea(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }

        const existing = await areaModel.getAreaById(id);
        if (!existing) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }

        await areaModel.deleteArea(id);
    }
}

// Exportar una instancia del modelo
module.exports = new AreaService();
