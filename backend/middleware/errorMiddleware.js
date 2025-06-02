// errorMiddleware.js

// Importamos nuestra clase personalizada de errores
const ApiError = require('../errors/apiError');

// Middleware para capturar y responder
const errorHandler = (err, req, res, next) => {

    // Si el error lanzado es una instancia de ApiError (nuestro error controlado)
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Si el error no es una instancia esperada (error desconocido del sistema o código)
    console.error('[Error inesperado]', err); // Lo imprimimos en consola para depuración

    // Respondemos con un error generico 500
    return res.status(500).json({ message: 'Algo salió mal en el servidor' });
};

// Exportamos el middleware para usarlo en app.js
module.exports = errorHandler;
