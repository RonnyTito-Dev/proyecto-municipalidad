// userModel.js

// Importamos la DB
const db = require('../config/db');

class UserModel {

    // ============================= MÉTODOS GET ==============================

    // Obtener todos los usuarios
    async getAllUsers() {
        const result = await db.query(`SELECT
                us.id,
                us.nombres,
                us.apellidos,
                us.dni,
                us.email,
                us.celular,
                ro.nombre AS rol,
                ar.nombre AS area,
                eu.id AS id_estado_usuario,
                eu.nombre AS estado_usuario,
                TO_CHAR(us.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado_registro,
                er.nombre AS estado_registro
						FROM usuarios us
            INNER JOIN roles ro ON us.rol_id = ro.id
            INNER JOIN areas ar ON us.area_id = ar.id
            INNER JOIN estados_usuario eu ON us.estado_usuario_id = eu.id
            INNER JOIN estados_registro er ON us.estado_registro_id = er.id`);
        return result.rows;
    }

    // Obtener usuarios habilitados
    async getEnabledUsers() {
        const result = await db.query(
            `SELECT
                us.id,
                us.nombres,
                us.apellidos,
                us.dni,
                us.email,
                us.celular,
                ro.nombre AS rol,
                ar.nombre AS area,
                eu.id AS id_estado_usuario,
                eu.nombre AS estado_usuario,
                TO_CHAR(us.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado_registro,
                er.nombre AS estado_registro
						FROM usuarios us
            INNER JOIN roles ro ON us.rol_id = ro.id
            INNER JOIN areas ar ON us.area_id = ar.id
            INNER JOIN estados_usuario eu ON us.estado_usuario_id = eu.id
            INNER JOIN estados_registro er ON us.estado_registro_id = er.id
            WHERE us.estado_usuario_id = 1`
        );
        return result.rows;
    }

    // Obtener usuarios deshabilitados
    async getDisabledUsers() {
        const result = await db.query(
            `SELECT
                us.id,
                us.nombres,
                us.apellidos,
                us.dni,
                us.email,
                us.celular,
                ro.nombre AS rol,
                ar.nombre AS area,
                eu.id AS id_estado_usuario,
                eu.nombre AS estado_usuario,
                TO_CHAR(us.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado_registro,
                er.nombre AS estado_registro
						FROM usuarios us
            INNER JOIN roles ro ON us.rol_id = ro.id
            INNER JOIN areas ar ON us.area_id = ar.id
            INNER JOIN estados_usuario eu ON us.estado_usuario_id = eu.id
            INNER JOIN estados_registro er ON us.estado_registro_id = er.id
            WHERE us.estado_usuario_id = 2`
        );
        return result.rows;
    }

    // Obtener usuarios sin eliminar
    async getActiveUsers() {
        const result = await db.query(
            `SELECT
                us.id,
                us.nombres,
                us.apellidos,
                us.dni,
                us.email,
                us.celular,
                ro.nombre AS rol,
                ar.nombre AS area,
                eu.id AS id_estado_usuario,
                eu.nombre AS estado_usuario,
                TO_CHAR(us.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado_registro,
                er.nombre AS estado_registro
						FROM usuarios us
            INNER JOIN roles ro ON us.rol_id = ro.id
            INNER JOIN areas ar ON us.area_id = ar.id
            INNER JOIN estados_usuario eu ON us.estado_usuario_id = eu.id
            INNER JOIN estados_registro er ON us.estado_registro_id = er.id
            WHERE us.estado_registro_id = 1`
        );
        return result.rows;
    }

    // Obtener usuarios eliminados
    async getDeletedUsers() {
        const result = await db.query(
            `SELECT
                us.id,
                us.nombres,
                us.apellidos,
                us.dni,
                us.email,
                us.celular,
                ro.nombre AS rol,
                ar.nombre AS area,
                eu.id AS id_estado_usuario,
                eu.nombre AS estado_usuario,
                TO_CHAR(us.fecha_creacion, 'DD/MM/YYYY HH24:MI:SS') AS fecha_creacion,
                er.id AS id_estado_registro,
                er.nombre AS estado_registro
						FROM usuarios us
            INNER JOIN roles ro ON us.rol_id = ro.id
            INNER JOIN areas ar ON us.area_id = ar.id
            INNER JOIN estados_usuario eu ON us.estado_usuario_id = eu.id
            INNER JOIN estados_registro er ON us.estado_registro_id = er.id
            WHERE us.estado_registro_id = 2`
        );
        return result.rows;
    }

    // Obtener un usuario por ID
    async getUserById(id) {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Obtener un usuario por email
    async getUserByEmail(email) {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    // Obtener un usuario por DNI
    async getUserByDni(dni) {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE dni = $1',
            [dni]
        );
        return result.rows[0];
    }

    // Obtener un usuario por celular
    async getUserByPhone(celular) {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE celular = $1',
            [celular]
        );
        return result.rows[0];
    }

    // ============================= MÉTODO POST =============================

    // Crear un nuevo usuario
    async createUser({ nombres, apellidos, dni, email, celular, pin_seguridad, contrasenia, rol_id, area_id, estado_usuario_id }) {
        const result = await db.query(
            `INSERT INTO usuarios
       (nombres, apellidos, dni, email, celular, pin_seguridad, contrasenia, rol_id, area_id, estado_usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [nombres, apellidos, dni, email, celular, pin_seguridad, contrasenia, rol_id, area_id, estado_usuario_id]
        );
        return result.rows[0];
    }

    // ============================= MÉTODOS PUT ==============================

    // Actualizar datos personales del usuario
    async updateUserData(id, { nombres, apellidos, email, celular }) {
        const result = await db.query(
            `UPDATE usuarios
       SET nombres = $1, apellidos = $2, email = $3, celular = $4
       WHERE id = $5
       RETURNING *`,
            [nombres, apellidos, email, celular, id]
        );
        return result.rows[0];
    }

    // Actualizar la contraseña del usuario
    async updateUserPassword(id, contrasenia_nueva) {
        const result = await db.query(
            `UPDATE usuarios
       SET contrasenia = $1
       WHERE id = $2
       RETURNING *`,
            [contrasenia_nueva, id]
        );
        return result.rows[0];
    }

    // Actualizar el PIN del usuario
    async updateUserPin(id, pin_nuevo) {
        const result = await db.query(
            `UPDATE usuarios
       SET pin = $1
       WHERE id = $2
       RETURNING *`,
            [pin_nuevo, id]
        );
        return result.rows[0];
    }

    // Cambiar el rol asignado al usuario
    async updateUserRol(id, nuevo_rol_id) {
        const result = await db.query(
            `UPDATE usuarios
       SET rol_id = $1
       WHERE id = $2
       RETURNING *`,
            [nuevo_rol_id, id]
        );
        return result.rows[0];
    }

    // Cambiar el área asignada al usuario
    async updateUserArea(id, nueva_area_id) {
        const result = await db.query(
            `UPDATE usuarios
       SET area_id = $1
       WHERE id = $2
       RETURNING *`,
            [nueva_area_id, id]
        );
        return result.rows[0];
    }

    // Cambiar el estado del usuario (habilitar o deshabilitar)
    async updateUserState(id, nuevo_estado_usuario_id) {
        const result = await db.query(
            `UPDATE usuarios
       SET estado_usuario_id = $1
       WHERE id = $2
       RETURNING *`,
            [nuevo_estado_usuario_id, id]
        );
        return result.rows[0];
    }

    // ============================ MÉTODO PATCH =============================

    // Eliminación lógica
    async deleteUser(id) {
        await db.query(
            `UPDATE usuarios
       SET estado_registro_id = 2
       WHERE id = $1`,
            [id]
        );
    }

    // Restauracion lógica
    async restoreUser(id) {
        await db.query(
            `UPDATE usuarios
       SET estado_registro_id = 2
       WHERE id = $1`,
            [id]
        );
    }
}

// Exportar una instancia del modelo
module.exports = new UserModel();
