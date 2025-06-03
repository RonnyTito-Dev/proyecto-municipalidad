// services/userService.js

// Importar el modelo de usuario
const userModel = require('../models/userModel');

// Importar el formatter para formatear texto
const formatter = require('../utils/textFormatter');

// Importar manejo de errores personalizados
const ApiError = require('../errors/apiError');

// Importamos el hash
const bcryptHelper = require('../utils/bcryptHelper');

class UserService {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los usuarios
    async getAllUsers() {
        const users = await userModel.getAllUsers();
        if (!users || users.length === 0) {
            throw ApiError.notFound('No hay usuarios registrados');
        }
        return users;
    }

    // Obtener usuarios habilitados para el sistema
    async getEnabledUsers() {
        const users = await userModel.getEnabledUsers();
        if (!users || users.length === 0) {
            throw ApiError.notFound('No hay usuarios habilitados');
        }
        return users;
    }

    // Obtener usuarios deshabilitados para el sistema
    async getDisabledUsers() {
        const users = await userModel.getDisabledUsers();
        if (!users || users.length === 0) {
            throw ApiError.notFound('No hay usuarios activos deshabilitados');
        }
        return users;
    }

    // Obtener usuarios no eliminados (activos)
    async getActiveUsers() {
        const users = await userModel.getActiveUsers();
        if (!users || users.length === 0) {
            throw ApiError.notFound('No hay usuarios activos registrados');
        }
        return users;
    }

    // Obtener usuarios eliminados
    async getDeletedUsers() {
        const users = await userModel.getDeletedUsers();
        if (!users || users.length === 0) {
            throw ApiError.notFound('No hay usuarios eliminados registrados');
        }
        return users;
    }

    // Obtener un usuario por ID
    async getUserById(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }
        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    // Obtener un usuario por email
    async getUserByEmail(email) {
        if (!email) {
            throw ApiError.badRequest('El email es requerido');
        }

        // Validacion estricta email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw ApiError.badRequest('El formato del email no es válido');
        }

        const emailFormatted = formatter.toLowerCase(email);
        const user = await userModel.getUserByEmail(emailFormatted);
        if (!user) {
            throw ApiError.notFound(`Usuario con email "${emailFormatted}" no encontrado`);
        }
        return user;
    }


    // Obtener usuario por DNI
    async getUserByDni(dni) {
        if (!dni) {
            throw ApiError.badRequest('El DNI es requerido');
        }

        // Validacion estricta
        const dniRegex = /^\d{8}$/;
        if (!dniRegex.test(dni)) {
            throw ApiError.badRequest('El DNI debe tener exactamente 8 dígitos numéricos');
        }

        const dniFormatted = formatter.toUpperCase(dni);
        const user = await userModel.getUserByDni(dniFormatted);
        if (!user) {
            throw ApiError.notFound(`Usuario con DNI "${dniFormatted}" no encontrado`);
        }
        return user;
    }

    // Obtener usuario por celular
    async getUserByPhone(celular) {
        if (!celular) {
            throw ApiError.badRequest('El celular es requerido');
        }

        // Validacion estricta del celular
        const celularRegex = /^\d{9}$/;

        if (!celularRegex.test(celular)) {
            throw ApiError.badRequest('El celular debe tener exactamente 9 dígitos numéricos');
        }
        const celularFormatted = formatter.trim(celular);
        const user = await userModel.getUserByPhone(celularFormatted);
        if (!user) {
            throw ApiError.notFound(`Usuario con celular "${celularFormatted}" no encontrado`);
        }
        return user;
    }


    // ============================= MÉTODO POST ==============================

    // Crear un nuevo usuario
    async addUser(data) {

        // Validar nombres
        if (!data.nombres?.trim()) throw ApiError.badRequest('El nombre es requerido');

        // Validar apellidos
        if (!data.apellidos?.trim()) throw ApiError.badRequest('El apellido es requerido');

        // Validar dni
        if (!data.dni?.trim()) throw ApiError.badRequest('El DNI es requerido');

        if (typeof data.dni !== 'string' || data.dni.trim().length !== 8 || !/^\d{8}$/.test(data.dni.trim())) {
            throw ApiError.badRequest('El DNI debe ser un string de 8 dígitos numéricos');
        }

        // Validar email
        if (!data.email?.trim()) throw ApiError.badRequest('El email es requerido');
        if (typeof data.email !== 'string' || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
            throw ApiError.badRequest('El email debe tener un formato válido');
        }

        // Validar el celular
        if (!data.celular?.trim()) throw ApiError.badRequest('El celular es requerido');

        if (typeof data.celular !== 'string' || !/^\d{9}$/.test(data.celular.trim())) {
            throw ApiError.badRequest('El celular debe ser un string de 9 dígitos numéricos');
        }

        // Validar el pin
        if (!data.pin_seguridad?.trim()) throw ApiError.badRequest('El PIN es requerido');

        if (typeof data.pin_seguridad !== 'string' || !/^\d{4}$/.test(data.pin_seguridad.trim())) {
            throw ApiError.badRequest('El PIN debe ser de 4 dígitos numéricos');
        }

        // Validar contrasenia
        if (!data.contrasenia?.trim()) throw ApiError.badRequest('La contraseña es requerida');
        if (data.contrasenia.trim().length < 8) throw ApiError.badRequest('La contraseña debe tener al menos 8 caracteres');

        // Validar rol
        if (data.rol_id === undefined || data.rol_id === null || !Number.isInteger(data.rol_id) || data.rol_id <= 0) {
            throw ApiError.badRequest('El rol debe ser un número entero positivo');
        }

        // Validar area
        if (data.area_id === undefined || data.area_id === null || !Number.isInteger(data.area_id) || data.area_id <= 0) {
            throw ApiError.badRequest('El área debe ser un número entero positivo');
        }

        // Validar estado del usuario
        if (data.estado_usuario_id === undefined || data.estado_usuario_id === null || !Number.isInteger(data.estado_usuario_id) || data.estado_usuario_id <= 0) {
            throw ApiError.badRequest('El estado usuario debe ser un número entero positivo');
        }

        // Formateo de datos
        const nombres = formatter.toTitleCase(data.nombres);
        const apellidos = formatter.toTitleCase(data.apellidos);
        const dni = formatter.toUpperCase(data.dni);
        const email = formatter.toLowerCase(data.email);
        const celular = formatter.trim(data.celular);
        const rol_id = data.rol_id;
        const area_id = data.area_id;
        const estado_usuario_id = data.estado_usuario_id;

        // Hashear pin y contrasenia
        const pin_seguridad = await bcryptHelper.hashPin(formatter.toUpperCase(data.pin));
        const contrasenia = await bcryptHelper.hashPassword(data.contrasenia);


        // Verificar email, dni y celular
        if (await userModel.getUserByEmail(email)) throw ApiError.conflict('El email ya está registrado por otro usuario');

        if (await userModel.getUserByDni(dni)) throw ApiError.conflict('El DNI ya está registrado por otro usuario');

        if (await userModel.getUserByPhone(celular)) throw ApiError.conflict('El celular ya está registrado por otro usuario');

        // Crear el registro
        return await userModel.createUser({
            nombres,
            apellidos,
            dni,
            email,
            celular,
            pin_seguridad,
            contrasenia,
            rol_id,
            area_id,
            estado_usuario_id,
        });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar datos personales (nombres, apellidos, email, celular)
    async updateUserData(id, data) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        // Validar nombres
        if (!data.nombres?.trim()) throw ApiError.badRequest('El nombre es requerido');

        // Validar apellidos
        if (!data.apellidos?.trim()) throw ApiError.badRequest('El apellido es requerido');

        // Validar email
        if (!data.email?.trim()) throw ApiError.badRequest('El email es requerido');
        if (typeof data.email !== 'string' || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
            throw ApiError.badRequest('El email debe tener un formato válido');
        }

        // Validar el celular
        if (!data.celular?.trim()) throw ApiError.badRequest('El celular es requerido');
        if (typeof data.celular !== 'string' || !/^\d{9}$/.test(data.celular.trim())) {
            throw ApiError.badRequest('El celular debe tener de 9 dígitos numéricos');
        }

        // Formatear datos
        const nombres = formatter.toTitleCase(data.nombres);
        const apellidos = formatter.toTitleCase(data.apellidos);
        const email = formatter.toLowerCase(data.email);
        const celular = formatter.trim(data.celular);

        // Verificar usuario
        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        // Validar unicidad si cambian email
        if (email !== user.email) {
            const emailExists = await userModel.getUserByEmail(email);
            if (emailExists && emailExists.id !== user.id) {
                throw ApiError.conflict('El email ya está en uso por otro usuario');
            }
        }

        // Validar unicidad si cambian celular
        if (celular !== user.celular) {
            const celularExists = await userModel.getUserByPhone(celular);
            if (celularExists && celularExists.id !== user.id) {
                throw ApiError.conflict('El celular ya está en uso por otro usuario');
            }
        }

        // Validar si hay cambios
        if (nombres === user.nombres && apellidos === user.apellidos &&
            email === user.email && celular === user.celular
        ) {
            throw ApiError.conflict('No se detectaron cambios para actualizar');
        }

        return await userModel.updateUserData(id, {
            nombres,
            apellidos,
            email,
            celular,
        });
    }

    // Actualizar la contraseña del usuario
    async updateUserPassword(id, data) {
        // Validar id
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        // Validar contrasenias
        if (!data.contrasenia_actual || !data.contrasenia_nueva) {
            throw ApiError.badRequest('Se requiere la contraseña actual y la nueva contraseña');
        }

        if (data.contrasenia_actual.length < 8) throw ApiError.badRequest('La contraseña actual debe tener al menos 8 caracteres');

        if (data.contrasenia_nueva.length < 8) throw ApiError.badRequest('La contraseña nueva debe tener al menos 8 caracteres');

        // Guardar valores
        const contrasenia_actual = data.contrasenia_actual;
        const contrasenia_nueva = await bcryptHelper.hashPassword(data.contrasenia_nueva);

        // Buscar usuario
        const user = await userModel.getUserById(id);

        // Verificar usuario
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        // Verficar contraseña actual
        const contraseniaValida = await bcryptHelper.comparePassword(contrasenia_actual, user.contrasenia);
        if (!contraseniaValida) {
            throw ApiError.badRequest('La contraseña actual es incorrecta');
        }

        // Verificar que las contraseñas no sean las mismas
        const contraseniasIguales = await bcryptHelper.comparePassword(data.contrasenia_nueva, user.contrasenia);
        if (contraseniasIguales) {
            throw ApiError.conflict('La nueva contraseña no puede ser igual a la anterior');
        }

        return await userModel.updateUserPassword(id, contrasenia_nueva);
    }

    // Actualizar el PIN del usuario
    async updateUserPin(id, data) {
        // Validar id
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        // Validar PINs
        if (!data.pin_actual || !data.pin_nuevo) {
            throw ApiError.badRequest('Se requiere el PIN actual y el nuevo PIN');
        }

        if (!/^\d{4}$/.test(data.pin_actual)) {
            throw ApiError.badRequest('El PIN actual debe ser un número de 4 dígitos');
        }

        if (!/^\d{4}$/.test(data.pin_nuevo)) {
            throw ApiError.badRequest('El PIN nuevo debe ser un número de 4 dígitos');
        }

        // Guardar valores
        const pin_actual = data.pin_actual;
        const pin_nuevo = await bcryptHelper.hashPin(data.pin_nuevo);

        // Buscar usuario
        const user = await userModel.getUserById(id);

        // Verificar existencia
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        // Verificar PIN actual
        const pinValido = await bcryptHelper.comparePin(pin_actual, user.pin);
        if (!pinValido) {
            throw ApiError.badRequest('El PIN actual es incorrecto');
        }

        // Verificar que los pines sean distintos
        const pinsIguales = await bcryptHelper.comparePin(data.pin_nuevo, user.pin);
        if (pinsIguales) {
            throw ApiError.conflict('El nuevo PIN no puede ser igual al anterior');
        }

        // Actualizar en base de datos
        return await userModel.updateUserPin(id, pin_nuevo);
    }

    // Cambiar el rol  al usuario
    async updateUserRol(id, rol_id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        if (rol_id === undefined || rol_id === null || isNaN(Number(rol_id)) || Number(rol_id) <= 0 || !Number.isInteger(Number(rol_id))) {
            throw ApiError.badRequest('El ID del rol debe ser un número entero positivo');
        }


        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.rol_id === Number(rol_id)) {
            throw ApiError.conflict('El rol del usuario es la misma');
        }

        return await userModel.updateUserArea(id, rol_id);
    }

    // Cambiar el área asignada al usuario
    async updateUserArea(id, area_id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        if (area_id === undefined || area_id === null || isNaN(Number(area_id)) || Number(area_id) <= 0 || !Number.isInteger(Number(area_id))) {
            throw ApiError.badRequest('El ID del área debe ser un número entero positivo');
        }


        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.area_id === Number(area_id)) {
            throw ApiError.conflict('El área asignada es la misma');
        }

        return await userModel.updateUserArea(id, area_id);
    }

    // Cambiar el estado del usuario (habiilitar o deshabilitar)
    async updateUserState(id, nuevoEstadoUsuarioId) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }
        if (!nuevoEstadoUsuarioId || isNaN(nuevoEstadoUsuarioId) || Number(nuevoEstadoUsuarioId) <= 0 || !Number.isInteger(Number(nuevoEstadoUsuarioId))) {
            throw ApiError.badRequest('El ID del estado usuario debe ser un número entero positivo');
        }

        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.estado_usuario_id === Number(nuevoEstadoUsuarioId)) {
            throw ApiError.conflict('El estado usuario es el mismo');
        }

        return await userModel.updateUserState(id, Number(nuevoEstadoUsuarioId));
    }

    // ============================ MÉTODO PACTH =============================

    // Eliminación lógica
    async removeUser(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.estado_registro_id === 2) {
            throw ApiError.conflict('Usuario ya eliminado');
        }

        await userModel.deleteUser(id);
    }

    
    // Restauracion lógica
    async restoreUser(id) {
        if (!id || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
            throw ApiError.badRequest('El ID del usuario debe ser un número entero positivo');
        }

        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.estado_registro_id === 1) {
            throw ApiError.conflict('Usuario ya esta restaurado');
        }

        await userModel.restoreUser(id);
    }
}

// Exportar instancia del servicio
module.exports = new UserService();
