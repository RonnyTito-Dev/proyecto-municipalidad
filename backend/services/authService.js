// services/authService.js

// Importar el modelo de usuario
const userModel = require('../models/userModel');

// Importar funciones para hash y comparación de contraseña
const bcryptHelper = require('../utils/bcryptHelper');

// Importar manejador de errores
const ApiError = require('../errors/apiError');

// Importar JWT
const jwt = require('jsonwebtoken');

// Importar configuración JWT
const { jwt_config } = require('../config/config');

// Importamos el validador de zod
const { userLoginValidator } = require('../utils/validators');


class AuthService {

    // ============================ MÉTODO LOGIN ================================

    // Login de usuario
    async login(rawData) {

        // Validar los datos
        const { data, error } = userLoginValidator.safeParse(rawData);
        if(error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar los datos
        const { email, contrasenia } = data;

        // Buscar usuario por email
        const user = await userModel.getUserByEmail(email);
        if (!user) throw ApiError.notFound('El usuario no existe');

        // Verificar estado de usuario usuario 1 activo
        if(user.estado_usuario_id !== 1) throw ApiError.unauthorized('El usuario fue inhabilitado del sistema')

        // Verificar el estado del usuario eliminado
        if(user.estado_registro_id !== 1) throw ApiError.unauthorized('El usuario fue eliminado del sistema')

        // Comparar contraseña
        const contraseniaValida = await bcryptHelper.comparePassword(contrasenia, user.contrasenia);
        if (!contraseniaValida) throw ApiError.unauthorized('Contraseña incorrecta');

        // Generar token JWT
        const token = jwt.sign(
            {
                usuario_id: user.id,
                nombres_usuario: user.nombres,
                email_usuario: user.email,
                pin_usuario: user.pin_seguridad,
                rol_usuario_id: user.rol_id,
                area_usuario_id: user.area_id,
                estado_usuario_id: user.estado_usuario_id,
            },
            jwt_config.secretKey,
            { expiresIn: '1h' }
        );

        return token;
    }
}

// Exportar instancia del servicio
module.exports = new AuthService();
