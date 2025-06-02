// controllers/authController.js

// Importamos el AuthService
const authService = require('../services/authService');

// Importamos la configuracion de entorno del proyecto
const { project_config: { project_env } } = require('../config/config');

class AuthController {

    // ========================================== MÉTODO POST ==========================================

    // Login de usuario (autenticación)
    async login(req, res, next) {
        try {
            const { email, contrasenia } = req.body;

            // Autenticación con el service
            const token = await authService.login({ email, contrasenia });

            // Configurar cookie segura
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: project_env,
                sameSite: 'Strict',
                maxAge: 3600000, // 1 hora
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Autenticación exitosa',
                user: {
                    email: email
                }
            });

        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO GET ==========================================

    // Obtener información del usuario actual (requiere middleware de autenticación)
    async getCurrentUser(req, res, next) {
        try {
            // El middleware de autenticación inyecta el usuario en req.user
            const { user } = req;

            res.status(200).json({
                success: true,
                user: {
                    id_usuario: user.id_usuario,
                    nombres_usuario: user.nombres_usuario,
                    email_usuario: user.email_usuario,
                    pin_usuario: user.pin_usuario,
                    area_usuario_id: user.area_usuario_id,
                    estado_usuario_id: user.estado_usuario_id
                }
            });

        } catch (error) {
            next(error);
        }
    }

    // ========================================== MÉTODO POST ==========================================

    // Cerrar sesión (elimina la cookie)
    async logout(req, res, next) {
        try {
            res.clearCookie('authToken', {
                httpOnly: true,
                secure: project_env,
                sameSite: 'Strict',
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });

        } catch (error) {
            next(error);
        }
    }
}

// Exportamos la instancia del controller
module.exports = new AuthController();