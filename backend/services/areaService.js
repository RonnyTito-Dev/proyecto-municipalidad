// areaService.js

// Importar el modelo
const areaModel = require('../models/areaModel');

// Importar el validador de Zod
const { schemaIdValidator, schemaNameValidator, simpleCreateValidator, simpleUpdatedValidator, schemaBooleanValidator } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class AreaService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las áreas
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
    async getAreaById(rawId) {
        // Validar el id
        const { data, error } = schemaIdValidator('Area').safeParse(Number(rawId));
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar id
        const id = data;

        const area = await areaModel.getAreaById(id);
        if (!area) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }
        return area;
    }

    // Obtener un área por nombre
    async getAreaByName(rawName) {

        // Validar el nombre
        const { data, error } = schemaNameValidator('Area').safeParse(rawName);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar Nombre
        const nombre = data;

        const area = await areaModel.getAreaByName(nombre);

        if (!area) {
            throw ApiError.notFound(`Área con nombre "${nombre}" no encontrado`);
        }
        return area;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear una nueva área
    async addArea(rawData) {

        // Validar datos
        const { data, error } = simpleCreateValidator('Area').safeParse(rawData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { nombre, descripcion } = data;

        // Verificar si ya existe un área con ese nombre
        const existing = await areaModel.getAreaByName(nombre);
        if (existing) {
            throw ApiError.conflict(`El área con nombre "${nombre}" ya está registrado`);
        }

        return await areaModel.createArea({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un área
    async modifyArea(rawId, rawData) {

        // Validar datos
        const { data, error } = simpleUpdatedValidator('Area').safeParse({ id: Number(rawId), ...rawData });
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperamos datos
        const { id, nombre, descripcion } = data;


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

    // Cambiar visibilidad pública
    async updateAreaVisibility(rawId, rawPublicArea) {

        // Validar datos
        const validatedId = schemaIdValidator('Area').safeParse(Number(rawId));
        if(validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        const validatedPublicArea = schemaBooleanValidator('Tipo de Area').safeParse(rawPublicArea);
        if(validatedPublicArea.error) throw ApiError.badRequest(validatedPublicArea.error.errors[0].message);

        // recuperar datos
        const id = validatedId.data;
        const area_publica = validatedPublicArea.data;

        const existing = await areaModel.getAreaById(id);
        if (!existing) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }

        // Validar si no hay cambio
        if (existing.area_publica === area_publica) {
            throw ApiError.conflict(`El valor de "area_publica" ya es ${area_publica}`);
        }

        return await areaModel.updateAreaVisibility(id, area_publica);
    }


    // ============================= MÉTODOS PATCH ==============================

    // Eliminado lógica
    async removeArea(rawId) {
        const { data, error } = schemaIdValidator('Area').safeParse(Number(rawId));
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar id
        const id = data;

        const existing = await areaModel.getAreaById(id);
        if (!existing) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }

        await areaModel.deleteArea(id);
    }

    // Restauracion lógica
    async restoreArea(rawId) {
        const { data, error } = schemaIdValidator('Area').safeParse(Number(rawId));
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar id
        const id = data;

        const existing = await areaModel.getAreaById(id);
        if (!existing) {
            throw ApiError.notFound(`Área con ID ${id} no encontrado`);
        }

        await areaModel.restoreArea(id);
    }

}

// Exportar una instancia del modelo
module.exports = new AreaService();
