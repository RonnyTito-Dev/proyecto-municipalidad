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

// Importamos el formater
const formatter = require('../utils/textFormatter');


class AuthService {

    // ============================ MÉTODO LOGIN ================================

    // Login de usuario
    async login({ email, contrasenia }) {

        // Validar campos obligatorios
        if (!email || !contrasenia) {
            throw ApiError.badRequest('Email y contraseña son requeridos');
        }

        // Validar email
        if (typeof email !== 'string' || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            throw ApiError.badRequest('El email debe tener un formato válido');
        }

        // Validar contrasenia
        if (contrasenia.trim().length < 8) {
            throw ApiError.badRequest('La contraseña debe tener al menos 8 caracteres');
        } 

        // Buscar usuario por email
        const user = await userModel.getUserByEmail(formatter.toLowerCase(email));
        if (!user) {
            throw ApiError.notFound('El usuario no existe');
        }

        // Verificar estado de usuario usuario 1 activo
        if(user.estado_usuario_id !== 1){
            throw ApiError.unauthorized('El usuario fue inhabilitado del sistema')
        }

        // Verificar el estado del usuario eliminado
        if(user.estado_registro_id !== 1){
            throw ApiError.unauthorized('El usuario fue eliminado del sistema')
        }

        // Comparar contraseña
        const contraseniaValida = await bcryptHelper.comparePassword(contrasenia, user.contrasenia);
        if (!contraseniaValida) {
            throw ApiError.unauthorized('Contraseña incorrecta');
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id_usuario: user.id,
                nombres_usuario: user.nombres,
                email_usuario: user.email,
                pin_usuario: user.pin,
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
