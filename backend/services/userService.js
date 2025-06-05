// services/userService.js

// Importar el modelo de usuario
const userModel = require('../models/userModel');

// Importar manejo de errores personalizados
const ApiError = require('../errors/apiError');

// Importamos el validador de Zod
const { schemaIdValidator, schemaEmailValidator, schemaDNIValidator, schemaPhoneValidator, userCreateValidador, userUpdatedValidador, userUpdatedPasswordValidador, userUpdatedPinValidador } = require('../utils/validators');

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
    async getUserById(rawId) {
        // Validar el id
        const { data, error } = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar id
        const id = data;

        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    // Obtener un usuario por email
    async getUserByEmail(rawEmail) {

        // Validar email
        const { data, error } = schemaEmailValidator('Usuario').safeParse(rawEmail);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el email
        const email = data;

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            throw ApiError.notFound(`Usuario con email "${email}" no encontrado`);
        }
        return user;
    }


    // Obtener usuario por DNI
    async getUserByDni(rawDNI) {

        // Vaidar DNI
        const { data, error } = schemaDNIValidator('Usuario').safeParse(rawDNI);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el email
        const dni = data;

        const user = await userModel.getUserByDni(dni);
        if (!user) {
            throw ApiError.notFound(`Usuario con DNI "${dni}" no encontrado`);
        }
        return user;
    }

    // Obtener usuario por celular
    async getUserByPhone(rawPhone) {

        // Validar celular
        const { data, error } = schemaPhoneValidator('Usuario').safeParse(rawPhone);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar celular
        const celular = data;

        const user = await userModel.getUserByPhone(celular);
        if (!user) {
            throw ApiError.notFound(`Usuario con celular "${celular}" no encontrado`);
        }
        return user;
    }


    // ============================= MÉTODO POST ==============================

    // Crear un nuevo usuario
    async addUser(rawData) {

        // Validar datos de usuario
        const { data, error } = userCreateValidador.safeParse(rawData);
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperamos datos
        const { nombres, apellidos, dni, email, celular, rol_id, area_id, estado_usuario_id } = data;

        // Hashear pin y contrasenia
        const pin_seguridad = await bcryptHelper.hashPin(data.pin_seguridad);
        const contrasenia = await bcryptHelper.hashPassword(data.contrasenia);

        // Verificar email, dni y celular
        if (await userModel.getUserByEmail(email)) throw ApiError.conflict('El email ya está registrado por otro usuario');

        if (await userModel.getUserByDni(dni)) throw ApiError.conflict('El DNI ya está registrado por otro usuario');

        if (await userModel.getUserByPhone(celular)) throw ApiError.conflict('El celular ya está registrado por otro usuario');

        // Crear el registro
        return await userModel.createUser({ nombres, apellidos, dni, email, celular, pin_seguridad,
            contrasenia, rol_id, area_id, estado_usuario_id
        });
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar datos personales (nombres, apellidos, email, celular)
    async updateUserData(rawId, rawData) {

        // Validar datos
        const { data, error } = userUpdatedValidador.safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar datos
        const { id, nombres, apellidos, email, celular } = data;

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

        return await userModel.updateUserData(id, { nombres, apellidos, email, celular });
    }

    // Actualizar la contraseña del usuario
    async updateUserPassword(rawId, rawData) {

        // Validar datos
        const { data, error } = userUpdatedPasswordValidador.safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperamos datos
        const id = data.id;

        // Guardar contraseñas
        const contrasenia_actual = data.contrasenia_actual;
        const contrasenia_nueva_raw = data.contrasenia_nueva;

        // Buscar usuario
        const user = await userModel.getUserById(id);
        if (!user) throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);

        // Verficar contraseña actual
        const contraseniaValida = await bcryptHelper.comparePassword(contrasenia_actual, user.contrasenia);
        if (!contraseniaValida) throw ApiError.badRequest('La contraseña actual es incorrecta');

        // Verificar que las contraseñas no sean las mismas
        const contraseniasIguales = await bcryptHelper.comparePassword(data.contrasenia_nueva, user.contrasenia);
        if (contraseniasIguales) throw ApiError.conflict('La nueva contraseña no puede ser igual a la anterior');

        // Hashear nueva contrasenia
        const contrasenia_nueva = await bcryptHelper.hashPassword(contrasenia_nueva_raw);

        return await userModel.updateUserPassword(id, contrasenia_nueva);
    }


    // Actualizar el PIN del usuario
    async updateUserPin(rawId, rawData) {

        // Validar datos
        const { data, error } = userUpdatedPinValidador.safeParse({ id: Number(rawId), ...rawData });
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperamos datos
        const id = data.id;

        // Guardar valores
        const pin_actual = data.pin_actual;
        const pin_nuevo_raw = data.pin_nuevo;

        // Buscar usuario
        const user = await userModel.getUserById(id);
        if (!user) throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);

        // Verificar PIN actual
        const pinValido = await bcryptHelper.comparePin(pin_actual, user.pin_seguridad);
        if (!pinValido) throw ApiError.badRequest('El PIN actual es incorrecto');

        // Verificar que los pines sean distintos
        const pinsIguales = await bcryptHelper.comparePin(data.pin_nuevo, user.pin_seguridad);
        if (pinsIguales) throw ApiError.conflict('El nuevo PIN no puede ser igual al anterior');

        // Hashear pin
        const pin_nuevo = await bcryptHelper.hashPin(pin_nuevo_raw);
        
        // Actualizar en base de datos
        return await userModel.updateUserPin(id, pin_nuevo);
    }

    // Cambiar el rol  al usuario
    async updateUserRol(rawId, rawRolId) {

        // Validar el id
        const validatedId = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        // Validar rol id
        const validatedRolId = schemaIdValidator('Rol').safeParse(Number(rawRolId));
        if (validatedRolId.error) throw ApiError.badRequest(validatedRolId.error.errors[0].message);

        // recuperar id
        const id = validatedId.data;
        const rol_id = validatedRolId.data;

        const user = await userModel.getUserById(id);

        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.rol_id === Number(rol_id)) {
            throw ApiError.conflict('El rol del usuario es la misma');
        }

        return await userModel.updateUserRol(id, rol_id);
    }

    // Cambiar el área asignada al usuario
    async updateUserArea(rawId, rawAreaId) {

        // Validar el id
        const validatedId = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        // Validar area id
        const validatedAreaId = schemaIdValidator('Area').safeParse(Number(rawAreaId));
        if (validatedAreaId.error) throw ApiError.badRequest(validatedAreaId.error.errors[0].message);

        // recuperar id
        const id= validatedId.data;
        const area_id = validatedAreaId.data;

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
    async updateUserState(rawId, rawUserStateId) {

        // Validar el id
        const validatedId = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (validatedId.error) throw ApiError.badRequest(validatedId.error.errors[0].message);

        // Validar estado usuario id
        const validatedUserStateId = schemaIdValidator('Estado de Usuario').safeParse(Number(rawUserStateId));
        if (validatedUserStateId.error) throw ApiError.badRequest(validatedUserStateId.error.errors[0].message);

        // recuperar id
        const id = validatedId.data;
        const estado_usuario_id = validatedUserStateId.data;

        const user = await userModel.getUserById(id);
        if (!user) {
            throw ApiError.notFound(`Usuario con ID ${id} no encontrado`);
        }

        if (user.estado_usuario_id === Number(estado_usuario_id)) {
            throw ApiError.conflict('El estado usuario es el mismo');
        }

        return await userModel.updateUserState(id, estado_usuario_id);
    }

    // ============================ MÉTODO PACTH =============================

    // Eliminación lógica
    async removeUser(rawId) {

        // Validar el id
        const { data, error } = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // recuperar el id
        const id = data;

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
    async restoreUser(rawId) {

        // Validar el id
        const {data, error } = schemaIdValidator('Usuario').safeParse(Number(rawId));
        if (error) throw ApiError.badRequest(error.errors[0].message);

        // Recuperar el id
        const id = data;

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
