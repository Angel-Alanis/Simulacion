const { getConnection, sql } = require('../config/database');

class DashboardController {
  // Obtener métricas del dashboard
  static async getStatistics(req, res) {
    try {
      const userId = req.user.userId;
      const pool = await getConnection();

      // Información del usuario
      const userInfo = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT u.user_id, u.username, u.email, u.full_name, u.created_at, l.level_name as current_level_name
          FROM Users u
          LEFT JOIN Levels l ON u.current_level_id = l.level_id
          WHERE u.user_id = @userId
        `);

      // Estadísticas generales
      const userStats = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM vw_DashboardStats WHERE user_id = @userId');

      // Intentos realizados por tipo de examen
      const examAttempts = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            et.type_name,
            et.max_attempts,
            COUNT(e.exam_id) as attempts_used,
            et.max_attempts - COUNT(e.exam_id) as attempts_remaining
          FROM ExamTypes et
          LEFT JOIN Exams e ON et.exam_type_id = e.exam_type_id 
            AND e.user_id = @userId 
            AND e.is_completed = 1
          GROUP BY et.type_name, et.max_attempts
        `);

      // Comparación entre exámenes de práctica y finales
      const attemptsComparison = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            et.type_name,
            COUNT(*) as total_attempts,
            AVG(e.percentage) as average_score,
            MAX(e.percentage) as best_score,
            SUM(CASE WHEN e.passed = 1 THEN 1 ELSE 0 END) as passed_attempts
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          WHERE e.user_id = @userId AND e.is_completed = 1
          GROUP BY et.type_name
        `);

      // Rendimiento por nivel
      const levelProgress = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            l.level_name,
            COUNT(*) as questions_answered,
            SUM(CAST(ua.is_correct AS INT)) as correct_answers,
            CAST(SUM(CAST(ua.is_correct AS INT)) AS FLOAT) / COUNT(*) * 100 as accuracy
          FROM UserAnswers ua
          INNER JOIN Exams e ON ua.exam_id = e.exam_id
          INNER JOIN Questions q ON ua.question_id = q.question_id
          INNER JOIN Levels l ON q.level_id = l.level_id
          WHERE e.user_id = @userId
          GROUP BY l.level_name, l.level_order
          ORDER BY l.level_order
        `);

      // Comparación de puntajes entre primer intento de práctica y final
      const practiceBenefit = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          WITH PracticeFirst AS (
            SELECT TOP 1 percentage 
            FROM Exams e
            INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
            WHERE e.user_id = @userId AND et.type_name = 'Practice' AND e.is_completed = 1
            ORDER BY e.start_time ASC
          ),
          FinalFirst AS (
            SELECT TOP 1 percentage 
            FROM Exams e
            INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
            WHERE e.user_id = @userId AND et.type_name = 'Final' AND e.is_completed = 1
            ORDER BY e.start_time ASC
          )
          SELECT 
            ISNULL((SELECT percentage FROM PracticeFirst), 0) as first_practice_score,
            ISNULL((SELECT percentage FROM FinalFirst), 0) as first_final_score
        `);

      // Últimos 10 exámenes realizados
      const recentHistory = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT TOP 10
            e.exam_id,
            e.start_time,
            e.end_time,
            e.percentage,
            e.passed,
            et.type_name as exam_type,
            l.level_name as level_achieved
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          LEFT JOIN Levels l ON e.level_achieved_id = l.level_id
          WHERE e.user_id = @userId AND e.is_completed = 1
          ORDER BY e.start_time DESC
        `);

      // Tiempo promedio de respuesta
      const avgTime = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT AVG(ua.time_taken_seconds) as avg_time_per_question
          FROM UserAnswers ua
          INNER JOIN Exams e ON ua.exam_id = e.exam_id
          WHERE e.user_id = @userId
        `);

      res.json({
        success: true,
        data: {
          user: userInfo.recordset[0],
          userStatistics: userStats.recordset[0],
          examAttempts: examAttempts.recordset,
          attemptsComparison: attemptsComparison.recordset,
          levelProgress: levelProgress.recordset,
          practiceBenefit: practiceBenefit.recordset[0],
          recentHistory: recentHistory.recordset,
          averageTimePerQuestion: avgTime.recordset[0]?.avg_time_per_question || 0
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }

  // Obtener gráficas de progreso
  static async getProgressCharts(req, res) {
    try {
      const userId = req.user.userId;
      const pool = await getConnection();

      // Progreso temporal - scores a lo largo del tiempo
      const progressOverTime = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            e.exam_id,
            e.start_time,
            e.percentage,
            e.passed,
            et.type_name as exam_type
          FROM Exams e
          INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
          WHERE e.user_id = @userId AND e.is_completed = 1
          ORDER BY e.start_time ASC
        `);

      // Distribución de respuestas por nivel
      const answerDistribution = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            l.level_name,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) as correct,
            SUM(CASE WHEN ua.is_correct = 0 THEN 1 ELSE 0 END) as incorrect
          FROM UserAnswers ua
          INNER JOIN Exams e ON ua.exam_id = e.exam_id
          INNER JOIN Questions q ON ua.question_id = q.question_id
          INNER JOIN Levels l ON q.level_id = l.level_id
          WHERE e.user_id = @userId
          GROUP BY l.level_name, l.level_order
          ORDER BY l.level_order
        `);

      res.json({
        success: true,
        data: {
          progressOverTime: progressOverTime.recordset,
          answerDistribution: answerDistribution.recordset
        }
      });
    } catch (error) {
      console.error('Error al obtener gráficas de progreso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener gráficas',
        error: error.message
      });
    }
  }

  // Análisis de práctica vs final
  static async getPracticeFinalAnalysis(req, res) {
    try {
      const userId = req.user.userId;
      const pool = await getConnection();

      // Comparación detallada
      const analysis = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          WITH PracticeStats AS (
            SELECT 
              COUNT(*) as total_practices,
              AVG(percentage) as avg_practice_score,
              MAX(percentage) as max_practice_score,
              SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_practices
            FROM Exams e
            INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
            WHERE e.user_id = @userId AND et.type_name = 'Practice' AND e.is_completed = 1
          ),
          FinalStats AS (
            SELECT 
              COUNT(*) as total_finals,
              AVG(percentage) as avg_final_score,
              MAX(percentage) as max_final_score,
              SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_finals
            FROM Exams e
            INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
            WHERE e.user_id = @userId AND et.type_name = 'Final' AND e.is_completed = 1
          )
          SELECT 
            p.*,
            f.*,
            CASE 
              WHEN p.total_practices > 0 AND f.total_finals > 0 
              THEN f.avg_final_score - p.avg_practice_score
              ELSE 0 
            END as score_improvement
          FROM PracticeStats p, FinalStats f
        `);

      res.json({
        success: true,
        data: analysis.recordset[0] || {
          total_practices: 0,
          avg_practice_score: 0,
          max_practice_score: 0,
          passed_practices: 0,
          total_finals: 0,
          avg_final_score: 0,
          max_final_score: 0,
          passed_finals: 0,
          score_improvement: 0
        },
        message: analysis.recordset[0]?.score_improvement > 0 
          ? '¡Las prácticas están ayudando a mejorar tu desempeño!'
          : 'Continúa practicando para mejorar tus resultados'
      });
    } catch (error) {
      console.error('Error al obtener análisis práctica vs final:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener análisis',
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;
