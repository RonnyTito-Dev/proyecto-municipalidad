// apiError.js

// Clase personalizada para manejar errores específicos en la API
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    // Error 400 - Peticion mal formada o invalida por parte del cliente
    static badRequest(message = 'Solicitud incorrecta') {
        return new ApiError(400, message);
    }

    // Error 404 - Recurso no encontrado en el servidor
    static notFound(message = 'Recurso no encontrado') {
        return new ApiError(404, message);
    }

    // Error 500 - Fallo interno del servidor
    static internal(message = 'Error interno del servidor') {
        return new ApiError(500, message);
    }

    // Error 401 - No autorizado (credenciales invalidas o inexistentes)
    static unauthorized(message = 'No autorizado') {
        return new ApiError(401, message);
    }

    // Error 409 - Conflicto (por ejemplo: datos duplicados, inconsistencias, etc.)
    static conflict(message = 'Conflicto de datos') {
        return new ApiError(409, message);
    }
}

// Exportamos la clase
module.exports = ApiError;
