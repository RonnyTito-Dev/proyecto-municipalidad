// authMiddleware.js

// Importamos JSON Web Token
const jwt = require('jsonwebtoken');

// Importamos nuestra configuración JWT (llave secreta)
const { jwt_config } = require('../config/config');

// Importamos nuestra clase para manejo de errores
const ApiError = require('../errors/apiError');

// Middleware de autenticacion para rutas protegidas
const authMiddleware = (req, res, next) => {
    // Extraemos el token desde las cookies
    const token = req.cookies.authToken;

    // Si no hay token, negamos el acceso
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, token faltante' });
    }

    try {
        // Verificamos y decodificamos el token con nuestra llave secreta
        const decoded = jwt.verify(token, jwt_config.secretKey);

        // Guardamos la info del usuario en la solicitud
        req.user = decoded;

        // Continuamos con el siguiente middleware o controlador
        next();

    } catch (error) {
        // Si el token invalido respondemos con un error controlado
        next(ApiError.unauthorized('Token inválido o expirado'));
    }
}

// Exportamos el middleware
module.exports = authMiddleware;
