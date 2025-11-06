const { getConnection, sql } = require('../config/database');

class ExamModel {
  // Crear nuevo examen
  static async create(examData) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('userId', sql.Int, examData.userId)
        .input('examTypeId', sql.Int, examData.examTypeId)
        .input('attemptNumber', sql.Int, examData.attemptNumber)
        .query(`
          INSERT INTO Exams (user_id, exam_type_id, start_time, attempt_number, is_completed)
          OUTPUT INSERTED.*
          VALUES (@userId, @examTypeId, GETDATE(), @attemptNumber, 0)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Asignar preguntas aleatorias al examen
  static async assignRandomQuestions(examId, questionCount, levelId = null) {
    try {
      const pool = await getConnection();
      
      // Si hay nivel específico, obtener preguntas solo de ese nivel
      if (levelId) {
        await pool.request()
          .input('examId', sql.Int, examId)
          .input('questionCount', sql.Int, questionCount)
          .input('levelId', sql.Int, levelId)
          .query(`
            WITH RandomQuestions AS (
              SELECT TOP (@questionCount) 
                question_id,
                ROW_NUMBER() OVER (ORDER BY NEWID()) as rn
              FROM Questions
              WHERE level_id = @levelId
              ORDER BY NEWID()
            )
            INSERT INTO ExamQuestions (exam_id, question_id, question_order)
            SELECT @examId, question_id, rn
            FROM RandomQuestions
            ORDER BY rn
          `);
      } else {
        // Obtener preguntas aleatorias de todos los niveles
        await pool.request()
          .input('examId', sql.Int, examId)
          .input('questionCount', sql.Int, questionCount)
          .query(`
            WITH RandomQuestions AS (
              SELECT TOP (@questionCount) 
                question_id,
                ROW_NUMBER() OVER (ORDER BY NEWID()) as rn
              FROM Questions
              ORDER BY NEWID()
            )
            INSERT INTO ExamQuestions (exam_id, question_id, question_order)
            SELECT @examId, question_id, rn
            FROM RandomQuestions
            ORDER BY rn
          `);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Obtener preguntas del examen
  static async getExamQuestions(examId) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('examId', sql.Int, examId)
        .query(`
          SELECT 
            eq.exam_question_id,
            eq.question_order,
            q.question_id,
            q.question_text,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.has_context,
            q.context_text,
            q.image_url,
            l.level_name
          FROM ExamQuestions eq
          INNER JOIN Questions q ON eq.question_id = q.question_id
          INNER JOIN Levels l ON q.level_id = l.level_id
          WHERE eq.exam_id = @examId
          ORDER BY eq.question_order
        `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Guardar respuesta del usuario
  static async saveAnswer(answerData) {
    try {
      const pool = await getConnection();
      
      // Obtener la respuesta correcta
      const questionResult = await pool.request()
        .input('questionId', sql.Int, answerData.questionId)
        .query('SELECT correct_answer FROM Questions WHERE question_id = @questionId');
      
      const correctAnswer = questionResult.recordset[0].correct_answer;
      const isCorrect = answerData.selectedAnswer === correctAnswer;
      
      const result = await pool.request()
        .input('examId', sql.Int, answerData.examId)
        .input('questionId', sql.Int, answerData.questionId)
        .input('selectedAnswer', sql.Char(1), answerData.selectedAnswer)
        .input('isCorrect', sql.Bit, isCorrect)
        .input('timeTaken', sql.Int, answerData.timeTakenSeconds)
        .query(`
          INSERT INTO UserAnswers (exam_id, question_id, selected_answer, is_correct, time_taken_seconds)
          OUTPUT INSERTED.*
          VALUES (@examId, @questionId, @selectedAnswer, @isCorrect, @timeTaken)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Finalizar examen y calcular resultados
  static async finalize(examId) {
    try {
      const pool = await getConnection();
      
      // Obtener información del examen
      const examInfo = await pool.request()
        .input('examId', sql.Int, examId)
        .query(`
          SELECT e.*, et.points_per_question, et.passing_score, et.type_name
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          WHERE e.exam_id = @examId
        `);
      
      const exam = examInfo.recordset[0];
      
      // Calcular puntuación
      const answersResult = await pool.request()
        .input('examId', sql.Int, examId)
        .query(`
          SELECT COUNT(*) as total_answers, SUM(CAST(is_correct AS INT)) as correct_answers
          FROM UserAnswers
          WHERE exam_id = @examId
        `);
      
      const { total_answers, correct_answers } = answersResult.recordset[0];
      const totalScore = correct_answers * exam.points_per_question;
      const percentage = (totalScore / (total_answers * exam.points_per_question)) * 100;
      const passed = percentage >= exam.passing_score;
      
      // Determinar nivel alcanzado basado en porcentaje
      // Basico: 0-69%, Intermedio: 70-84%, Avanzado: 85-100%
      let levelAchievedId = null;
      const levelResult = await pool.request()
        .input('percentage', sql.Decimal(5, 2), percentage)
        .query(`
          SELECT level_id, level_name
          FROM Levels
          WHERE @percentage >= min_percentage AND @percentage <= max_percentage
        `);
      
      if (levelResult.recordset.length > 0) {
        levelAchievedId = levelResult.recordset[0].level_id;
      }
      
      // Actualizar examen
      await pool.request()
        .input('examId', sql.Int, examId)
        .input('totalScore', sql.Decimal(5, 2), totalScore)
        .input('percentage', sql.Decimal(5, 2), percentage)
        .input('passed', sql.Bit, passed)
        .input('levelAchievedId', sql.Int, levelAchievedId)
        .query(`
          UPDATE Exams
          SET end_time = GETDATE(),
              total_score = @totalScore,
              percentage = @percentage,
              passed = @passed,
              level_achieved_id = @levelAchievedId,
              is_completed = 1
          WHERE exam_id = @examId
        `);
      
      // Actualizar estadísticas del usuario
      await this.updateUserStatistics(exam.user_id, exam.type_name, percentage);
      
      // Actualizar el nivel del usuario si alcanzó un nivel
      if (levelAchievedId) {
        const UserModel = require('./user.model');
        await UserModel.updateLevel(exam.user_id, levelAchievedId);
      }
      
      return {
        totalScore,
        percentage,
        passed,
        correctAnswers: correct_answers,
        totalAnswers: total_answers,
        levelAchievedId
      };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estadísticas del usuario
  static async updateUserStatistics(userId, examType, percentage) {
    try {
      const pool = await getConnection();
      
      if (examType === 'Practice') {
        await pool.request()
          .input('userId', sql.Int, userId)
          .input('percentage', sql.Decimal(5, 2), percentage)
          .query(`
            UPDATE UserStatistics
            SET total_practice_attempts = total_practice_attempts + 1,
                best_practice_score = CASE 
                  WHEN best_practice_score IS NULL OR @percentage > best_practice_score 
                  THEN @percentage 
                  ELSE best_practice_score 
                END,
                average_practice_score = (
                  SELECT AVG(percentage) 
                  FROM Exams 
                  WHERE user_id = @userId 
                    AND exam_type_id = (SELECT exam_type_id FROM ExamTypes WHERE type_name = 'Practice')
                    AND is_completed = 1
                ),
                updated_at = GETDATE()
            WHERE user_id = @userId
          `);
      } else if (examType === 'Final') {
        await pool.request()
          .input('userId', sql.Int, userId)
          .input('percentage', sql.Decimal(5, 2), percentage)
          .query(`
            UPDATE UserStatistics
            SET total_final_attempts = total_final_attempts + 1,
                best_final_score = CASE 
                  WHEN best_final_score IS NULL OR @percentage > best_final_score 
                  THEN @percentage 
                  ELSE best_final_score 
                END,
                average_final_score = (
                  SELECT AVG(percentage) 
                  FROM Exams 
                  WHERE user_id = @userId 
                    AND exam_type_id = (SELECT exam_type_id FROM ExamTypes WHERE type_name = 'Final')
                    AND is_completed = 1
                ),
                updated_at = GETDATE()
            WHERE user_id = @userId
          `);
      }
      
      // Actualizar totales generales
      await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          UPDATE UserStatistics
          SET total_questions_answered = (
                SELECT COUNT(*) FROM UserAnswers ua
                INNER JOIN Exams e ON ua.exam_id = e.exam_id
                WHERE e.user_id = @userId
              ),
              total_correct_answers = (
                SELECT SUM(CAST(ua.is_correct AS INT)) FROM UserAnswers ua
                INNER JOIN Exams e ON ua.exam_id = e.exam_id
                WHERE e.user_id = @userId
              )
          WHERE user_id = @userId
        `);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Obtener intentos del usuario
  static async getUserAttempts(userId, examType) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('examType', sql.VarChar(50), examType)
        .query(`
          SELECT COUNT(*) as attempts
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          WHERE e.user_id = @userId 
            AND et.type_name = @examType
            AND e.is_completed = 1
        `);
      
      return result.recordset[0].attempts;
    } catch (error) {
      throw error;
    }
  }

  // Obtener tipo de examen por nombre
  static async getExamTypeByName(typeName) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('typeName', sql.VarChar(50), typeName)
        .query('SELECT * FROM ExamTypes WHERE type_name = @typeName');
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener examen por ID
  static async findById(examId) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('examId', sql.Int, examId)
        .query(`
          SELECT 
            e.*,
            et.type_name,
            et.points_per_question,
            et.total_questions,
            l.level_name as level_achieved,
            (SELECT COUNT(*) FROM UserAnswers WHERE exam_id = e.exam_id AND is_correct = 1) as correct_answers,
            (SELECT COUNT(*) FROM UserAnswers WHERE exam_id = e.exam_id) as answered_questions
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          LEFT JOIN Levels l ON e.level_achieved_id = l.level_id
          WHERE e.exam_id = @examId
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener historial de exámenes del usuario
  static async getUserExamHistory(userId) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            e.exam_id,
            e.start_time,
            e.end_time,
            e.total_score,
            e.percentage,
            e.passed,
            e.attempt_number,
            e.is_completed,
            et.type_name as exam_type,
            l.level_name as level_achieved
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          LEFT JOIN Levels l ON e.level_achieved_id = l.level_id
          WHERE e.user_id = @userId
          ORDER BY e.start_time DESC
        `);
      
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExamModel;
