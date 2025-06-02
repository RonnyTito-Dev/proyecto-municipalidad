// actionController.js

// Importamos el ActionService
const actionService = require('../services/actionService');

class ActionController {

    // ========================================== METODOS GET ==========================================

    // Método para obtener todas las acciones
    async getActions(req, res, next) {
        try {
            const actions = await actionService.getActions();
            res.json(actions);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo las acciones activas
    async getActiveActions(req, res, next) {
        try {
            const actions = await actionService.getActiveActions();
            res.json(actions);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener solo las acciones eliminadas
    async getDeletedActions(req, res, next) {
        try {
            const actions = await actionService.getDeletedActions();
            res.json(actions);
        } catch (error) {
            next(error);
        }
    }

    // Método para obtener una acción por ID
    async getActionById(req, res, next) {
        const { id } = req.params;

        try {
            const action = await actionService.getActionById(id);
            res.json(action);

        } catch (error) {
            next(error);
        }
    }

    // Método para obtener una acción por nombre
    async getActionByName(req, res, next) {
        const { nombre } = req.params;

        try {
            const action = await actionService.getActionByName(nombre);
            res.json(action);

        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO POST ==========================================

    // Método para agregar una nueva acción
    async createAction(req, res, next) {
        const { nombre, descripcion } = req.body;

        try {
            const newAction = await actionService.addAction({ nombre, descripcion });
            res.status(201).json(newAction);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO PUT ==========================================

    // Método para actualizar una acción
    async updateAction(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            const updatedAction = await actionService.modifyAction(id, { nombre, descripcion });
            res.json(updatedAction);
        } catch (error) {
            next(error);
        }
    }

    // ========================================== METODO DELETE ==========================================

    // Método para eliminar una acción (eliminación lógica)
    async deleteAction(req, res, next) {
        const { id } = req.params;

        try {
            await actionService.removeAction(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia de la clase
module.exports = new ActionController();
