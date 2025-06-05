// services/actionService.js

// Importar el modelo
const actionModel = require('../models/actionModel');

// Importar el Validador de Zod
const { schemaIdValidator, schemaNameValidator, simpleCreateValidator, simpleUpdatedValidator } = require('../utils/validators');

// Importar los errores
const ApiError = require('../errors/apiError');

class ActionService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todas las acciones (sin importar estado)
    async getActions() {
        const actions = await actionModel.getAllActions();
        if (!actions || actions.length === 0) {
            throw ApiError.notFound('No hay acciones registradas');
        }
        return actions;
    }

    // Obtener solo acciones activas
    async getActiveActions() {
        const actions = await actionModel.getActiveActions();
        if (!actions || actions.length === 0) {
            throw ApiError.notFound('No hay acciones activas registradas');
        }
        return actions;
    }

    // Obtener solo acciones eliminadas
    async getDeletedActions() {
        const actions = await actionModel.getDeletedActions();
        if (!actions || actions.length === 0) {
            throw ApiError.notFound('No hay acciones eliminadas registradas');
        }
        return actions;
    }

    // Obtener una acción por ID
    async getActionById(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Accion').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar id
        const id = data;

        const action = await actionModel.getActionById(id);
        if (!action) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }
        return action;
    }

    // Obtener una acción por nombre
    async getActionByName(rawName) {

        // Validar nombre
        const { data, error } = schemaNameValidator('Accion').safeParse(rawName);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar nombre
        const nombre = data;

        const action = await actionModel.getActionByName(nombre);

        if (!action) {
            throw ApiError.notFound(`Acción con nombre "${nombre}" no encontrada`);
        }
        return action;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear una nueva acción
    async addAction(rawData) {

        // Validar nombre y descripcion
        const { data, error } = simpleCreateValidator('Accion').safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { nombre, descripcion } = data;

        // Verificar si ya existe una acción con ese nombre
        const existing = await actionModel.getActionByName(nombre);
        if (existing) {
            throw ApiError.conflict(`La acción con nombre "${nombre}" ya está registrada`);
        }

        return await actionModel.createAction({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar una acción
    async modifyAction(rawId, rawData) {

        // Validar el id
        const { data, error } = simpleUpdatedValidator('Accion').safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { id, nombre, descripcion } = data;

        // Verificar si la acción existe
        const existing = await actionModel.getActionById(id);
        if (!existing) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }

        // Validar si no hay cambios
        if (nombre === existing.nombre && descripcion === existing.descripcion) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        // Verificar si el nuevo nombre está en uso por otra acción
        const nombreDuplicado = await actionModel.getActionByName(nombre);

        if (nombreDuplicado && Number(nombreDuplicado.id) !== Number(id)) {
            throw ApiError.conflict(`La acción con nombre "${nombre}" ya está registrada por otra acción`);
        }

        return await actionModel.updateAction(id, { nombre, descripcion });
    }

    // ============================= MÉTODOS PATCH ==============================

    // Eliminación lógica
    async removeAction(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Accion').safeParse(Number(rawId))
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar id
        const id = data;

        const existing = await actionModel.getActionById(id);
        if (!existing) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }

        await actionModel.deleteAction(id);
    }

    // Restauracion lógica
    async restoreAction(rawId) {
        // Validar el id
        const { data, error } = schemaIdValidator('Accion').safeParse(Number(rawId))
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar el id
        const id = data;

        const existing = await actionModel.getActionById(id);
        if (!existing) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }

        await actionModel.restoreAction(id);
    }
}

// Exportar una instancia del servicio
module.exports = new ActionService();
