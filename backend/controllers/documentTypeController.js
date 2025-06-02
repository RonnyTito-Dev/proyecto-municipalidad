// controllers/documentTypeController.js

// Importamos el servicio de tipos de documento
const documentTypeService = require('../services/documentTypeService');

class DocumentTypeController {

    // ============================ MÉTODOS GET =============================

    // Obtener todos los tipos de documento (sin importar estado)
    async getDocumentTypes(req, res, next) {
        try {
            const types = await documentTypeService.getDocumentTypes();
            res.json(types);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo tipos de documento activos
    async getActiveDocumentTypes(req, res, next) {
        try {
            const types = await documentTypeService.getActiveDocumentTypes();
            res.json(types);
        } catch (error) {
            next(error);
        }
    }

    // Obtener solo tipos de documento eliminados
    async getDeletedDocumentTypes(req, res, next) {
        try {
            const types = await documentTypeService.getDeletedDocumentTypes();
            res.json(types);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un tipo de documento por ID
    async getDocumentTypeById(req, res, next) {
        const { id } = req.params;
        try {
            const type = await documentTypeService.getDocumentTypeById(id);
            res.json(type);
        } catch (error) {
            next(error);
        }
    }

    // Obtener un tipo de documento por nombre
    async getDocumentTypeByName(req, res, next) {
        const { nombre } = req.params;
        try {
            const type = await documentTypeService.getDocumentTypeByName(nombre);
            res.json(type);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO POST =============================

    // Crear un nuevo tipo de documento
    async createDocumentType(req, res, next) {
        const { nombre, descripcion } = req.body;
        try {
            const newType = await documentTypeService.addDocumentType({ nombre, descripcion });
            res.status(201).json(newType);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO PUT ==============================

    // Actualizar un tipo de documento por ID
    async updateDocumentType(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            const updatedType = await documentTypeService.modifyDocumentType(id, { nombre, descripcion });
            res.json(updatedType);
        } catch (error) {
            next(error);
        }
    }

    // ============================ MÉTODO DELETE ===========================

    // Eliminación lógica de un tipo de documento por ID
    async deleteDocumentType(req, res, next) {
        const { id } = req.params;
        try {
            await documentTypeService.removeDocumentType(id);
            res.sendStatus(204); // Sin contenido
        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia del controlador
module.exports = new DocumentTypeController();
