const { getConnection, sql } = require('../config/database');

class QuestionModel {
  // Obtener todas las preguntas
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT q.*, l.level_name
        FROM Questions q
        INNER JOIN Levels l ON q.level_id = l.level_id
        ORDER BY l.level_order, q.question_number
      `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener preguntas por nivel
  static async getByLevel(levelName) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('levelName', sql.VarChar(50), levelName)
        .query(`
          SELECT q.*, l.level_name
          FROM Questions q
          INNER JOIN Levels l ON q.level_id = l.level_id
          WHERE l.level_name = @levelName
          ORDER BY q.question_number
        `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener pregunta por ID
  static async findById(questionId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('questionId', sql.Int, questionId)
        .query(`
          SELECT q.*, l.level_name
          FROM Questions q
          INNER JOIN Levels l ON q.level_id = l.level_id
          WHERE q.question_id = @questionId
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener preguntas aleatorias
  static async getRandomQuestions(count) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('count', sql.Int, count)
        .query(`
          SELECT TOP (@count) q.*, l.level_name
          FROM Questions q
          INNER JOIN Levels l ON q.level_id = l.level_id
          ORDER BY NEWID()
        `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los niveles
  static async getAllLevels() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM Levels ORDER BY level_order
      `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QuestionModel;
