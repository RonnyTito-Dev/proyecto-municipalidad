// userModel.js

// Importamos la DB
const db = require('../config/db');

class UserModel {

  // ============================= MÉTODOS GET ==============================

  // Obtener todos los usuarios (sin filtro)
  async getAllUsers() {
    const result = await db.query('SELECT * FROM usuarios ORDER BY id');
    return result.rows;
  }

  // Obtener usuarios activos (estado_registro_id = 1)
  async getActiveUsers() {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE estado_registro_id = 1 ORDER BY id'
    );
    return result.rows;
  }

  // Obtener usuarios eliminados (estado_registro_id = 2)
  async getDeletedUsers() {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE estado_registro_id = 2 ORDER BY id'
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
  async createUser({ nombres, apellidos, dni, email, celular, pin, contrasenia, area_id, estado_usuario_id }) {
    const result = await db.query(
      `INSERT INTO usuarios
       (nombres, apellidos, dni, email, celular, pin, contrasenia, area_id, estado_usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [nombres, apellidos, dni, email, celular, pin, contrasenia, area_id, estado_usuario_id]
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

  // Cambiar el estado del usuario (activar o desactivar)
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

  // ============================ MÉTODO DELETE =============================

  // Eliminación lógica: actualizar estado_registro_id a 2 para marcar como eliminado
  async deleteUser(id) {
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
