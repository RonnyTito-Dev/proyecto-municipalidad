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

// Importar el log
const logService = require('./logService');


class AuthService {

    // ============================ MÉTODO LOGIN ================================

    // Login de usuario
    async login(rawData) {

        // Validar los datos
        const { data, error } = userLoginValidator.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar los datos
        const { email, contrasenia } = data;

        // Buscar usuario por email
        const user = await userModel.getUserByEmail(email);
        if (!user) throw ApiError.notFound('El usuario no existe');

        // Recuperar datos
        const { id, rol_id, area_id, estado_usuario_id, estado_registro_id } = user;

        // Verificar estado de usuario usuario 1 activo
        if (estado_usuario_id !== 1) throw ApiError.unauthorized('El usuario fue inhabilitado del sistema')

        // Verificar el estado del usuario eliminado
        if (estado_registro_id !== 1) throw ApiError.unauthorized('El usuario fue eliminado del sistema')

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
                rol_id: user.rol_id,
                area_id: user.area_id,
                estado_usuario_id: user.estado_usuario_id,
            },
            jwt_config.secretKey,
            { expiresIn: '1h' }
        );

        // Crear el log
        await logService.addLog({ usuario_id: id, rol_id, area_id, tabla_afectada: 'Ninguna', accion_id: 5 });

        return token;
    }



    // Cerrar sesion
    async logout(req, res) {
        
        // Obtener datos
        const { usuario_id, rol_id, area_id } = req.user;

        // Registrar log
        await logService.addLog({ usuario_id, rol_id, area_id, tabla_afectada: 'Ninguna', accion_id: 6 });

    }
}

// Exportar instancia del servicio
module.exports = new AuthService();
