const { getConnection, sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Crear usuario
  static async create(userData) {
    try {
      const pool = await getConnection();
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const result = await pool.request()
        .input('username', sql.VarChar(100), userData.username)
        .input('email', sql.VarChar(150), userData.email)
        .input('passwordHash', sql.VarChar(255), hashedPassword)
        .input('fullName', sql.NVarChar(200), userData.fullName)
        .query(`
          INSERT INTO Users (username, email, password_hash, full_name)
          OUTPUT INSERTED.*
          VALUES (@username, @email, @passwordHash, @fullName)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuario por username
  static async findByUsername(username) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('username', sql.VarChar(100), username)
        .query('SELECT * FROM Users WHERE username = @username');
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('email', sql.VarChar(150), email)
        .query('SELECT * FROM Users WHERE email = @email');
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuario por ID
  static async findById(userId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT u.*, l.level_name as current_level_name
          FROM Users u
          LEFT JOIN Levels l ON u.current_level_id = l.level_id
          WHERE u.user_id = @userId
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar nivel del usuario
  static async updateLevel(userId, levelId) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('levelId', sql.Int, levelId)
        .query(`
          UPDATE Users 
          SET current_level_id = @levelId, updated_at = GETDATE()
          WHERE user_id = @userId
        `);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Obtener o crear estadísticas del usuario
  static async getOrCreateStats(userId) {
    try {
      const pool = await getConnection();
      
      // Verificar si existen estadísticas
      let result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM UserStatistics WHERE user_id = @userId');
      
      if (result.recordset.length === 0) {
        // Crear estadísticas
        result = await pool.request()
          .input('userId', sql.Int, userId)
          .query(`
            INSERT INTO UserStatistics (user_id)
            OUTPUT INSERTED.*
            VALUES (@userId)
          `);
      }
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
