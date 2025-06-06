// services/documentTypeService.js

// Importamos el modelo
const documentTypeModel = require('../models/documentTypeModel');

// Importamos el validador de zod
const { schemaIdValidator, schemaNameValidator, simpleCreateValidator, simpleUpdatedValidator } = require('../utils/validators');

// Importamos el manejo de errores
const ApiError = require('../errors/apiError');

class DocumentTypeService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los tipos de documento
    async getDocumentTypes() {
        const types = await documentTypeModel.getAllDocumentTypes();
        if (!types || types.length === 0) {
            throw ApiError.notFound('No hay tipos de documento registrados');
        }
        return types;
    }

    // Obtener solo tipos de documento activos
    async getActiveDocumentTypes() {
        const types = await documentTypeModel.getActiveDocumentTypes();
        if (!types || types.length === 0) {
            throw ApiError.notFound('No hay tipos de documento activos');
        }
        return types;
    }

    // Obtener solo tipos de documento eliminados
    async getDeletedDocumentTypes() {
        const types = await documentTypeModel.getDeletedDocumentTypes();
        if (!types || types.length === 0) {
            throw ApiError.notFound('No hay tipos de documento eliminados');
        }
        return types;
    }

    // Obtener un tipo de documento por ID
    async getDocumentTypeById(rawId) {

        // Validar Id
        const { data, error } = schemaIdValidator('Tipo de documento').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const type = await documentTypeModel.getDocumentTypeById(id);
        if (!type) throw ApiError.notFound(`Tipo de documento con ID ${id} no encontrado`);

        return type;
    }

    // Obtener un tipo de documento por nombre
    async getDocumentTypeByName(rawName) {

        // Validar el nombre
        const { data, error } = schemaNameValidator('Tipo de documento').safeParse(rawName);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar el nombre
        const nombre = data;

        const type = await documentTypeModel.getDocumentTypeByName(nombre);
        if (!type) throw ApiError.notFound(`Tipo de documento con nombre "${nombre}" no encontrado`);

        return type;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear un nuevo tipo de documento
    async addDocumentType(rawData) {

        // Validar data
        const { data, error } = simpleCreateValidator('Tipo Documento').safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { nombre, descripcion } = data;


        // Verificar si ya existe un tipo con ese nombre
        const existing = await documentTypeModel.getDocumentTypeByName(nombre);
        if (existing) throw ApiError.conflict(`El tipo de documento con nombre "${nombre}" ya está registrado`);

        return await documentTypeModel.createDocumentType({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar un tipo de documento por ID
    async modifyDocumentType(rawId, rawData) {

        // validar datos
        const { data, error } = simpleUpdatedValidator('Tipo Documento').safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { id, nombre, descripcion } = data;


        // Verificar si el tipo de documento existe
        const existing = await documentTypeModel.getDocumentTypeById(id);
        if (!existing) throw ApiError.notFound(`Tipo de documento con ID ${id} no encontrado`);

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otro tipo
        const nombreDuplicado = await documentTypeModel.getDocumentTypeByName(nombre);
        if (nombreDuplicado && nombreDuplicado.id !== id) throw ApiError.conflict(`El tipo de documento con nombre "${nombre}" ya está registrado por otro tipo`);

        return await documentTypeModel.updateDocumentType(id, { nombre, descripcion });
    }

    // ============================= MÉTODOS PATCH ==============================

    // Eliminado lógica
    async removeDocumentType(rawId) {

        // Validar Id
        const { data, error } = schemaIdValidator('Tipo de documento').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const existing = await documentTypeModel.getDocumentTypeById(id);
        if (!existing) throw ApiError.notFound(`Tipo de documento con ID ${id} no encontrado`);

        await documentTypeModel.deleteDocumentType(id);
    }


    // Restauracion lógica
    async restoreDocumentType(rawId) {

        // Validar Id
        const { data, error } = schemaIdValidator('Tipo de documento').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

        const existing = await documentTypeModel.getDocumentTypeById(id);
        if (!existing) throw ApiError.notFound(`Tipo de documento con ID ${id} no encontrado`);

        await documentTypeModel.restoreDocumentType(id);
    }
}

// Exportar una instancia del servicio
module.exports = new DocumentTypeService();
