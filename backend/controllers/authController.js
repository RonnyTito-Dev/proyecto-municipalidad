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

    // Obtener información del usuario actual
    async getCurrentUser(req, res, next) {
        try {
            // El middleware de autenticación inyecta el usuario en req.user
            const { user } = req;

            res.status(200).json({
                success: true,
                user: {
                    usuario_id: user.usuario_id,
                    nombres_usuario: user.nombres_usuario,
                    email_usuario: user.email_usuario,
                    pin_usuario: user.pin_usuario,
                    rol_id: user.rol_id,
                    area_id: user.area_id,
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

            // Pasarle al service
            await authService.logout(req, res);

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