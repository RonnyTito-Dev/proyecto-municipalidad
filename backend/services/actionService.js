// services/actionService.js

// Importar el modelo
const actionModel = require('../models/actionModel');

// Importar el formatter
const formatter = require('../utils/textFormatter');

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
    async getActionById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID de la acción debe ser un número entero positivo');
        }

        const action = await actionModel.getActionById(id);
        if (!action) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }
        return action;
    }

    // Obtener una acción por nombre
    async getActionByName(nombre) {
        if (!nombre) {
            throw ApiError.badRequest('El nombre de la acción es requerido');
        }

        const nombreFormateado = formatter.toTitleCase(nombre);
        const action = await actionModel.getActionByName(nombreFormateado);

        if (!action) {
            throw ApiError.notFound(`Acción con nombre "${nombreFormateado}" no encontrada`);
        }
        return action;
    }

    // ============================= MÉTODOS POST ==============================

    // Crear una nueva acción
    async addAction(data) {
        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre de la acción es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

        // Verificar si ya existe una acción con ese nombre
        const existing = await actionModel.getActionByName(nombre);
        if (existing) {
            throw ApiError.conflict(`La acción con nombre "${nombre}" ya está registrada`);
        }

        return await actionModel.createAction({ nombre, descripcion });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar una acción
    async modifyAction(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID de la acción debe ser un número entero positivo');
        }

        if (!data.nombre.trim()) {
            throw ApiError.badRequest('El nombre de la acción es requerido');
        }

        const nombre = formatter.toTitleCase(data.nombre);
        const descripcion = formatter.trim(data.descripcion);

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

    // ============================= MÉTODOS DELETE ==============================

    // Eliminación lógica: actualizar estado_registro_id a 2
    async removeAction(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID de la acción debe ser un número entero positivo');
        }

        const existing = await actionModel.getActionById(id);
        if (!existing) {
            throw ApiError.notFound(`Acción con ID ${id} no encontrada`);
        }

        await actionModel.deleteAction(id);
    }
}

// Exportar una instancia del servicio
module.exports = new ActionService();
