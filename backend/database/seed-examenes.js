const { getConnection, sql } = require('../src/config/database');

// Función para obtener preguntas aleatorias de un nivel
async function getRandomQuestions(pool, levelId, count) {
  const result = await pool.request()
    .input('levelId', sql.Int, levelId)
    .input('count', sql.Int, count)
    .query(`
      SELECT TOP (@count) question_id, correct_answer
      FROM Questions
      WHERE level_id = @levelId
      ORDER BY NEWID()
    `);
  return result.recordset;
}

// Función para crear un examen completo
async function createCompletedExam(pool, userId, examTypeId, examLevelId, targetPercentage, attemptNumber) {
  try {
    // Obtener tipo de examen
    const examTypeResult = await pool.request()
      .input('examTypeId', sql.Int, examTypeId)
      .query('SELECT * FROM ExamTypes WHERE exam_type_id = @examTypeId');
    const examType = examTypeResult.recordset[0];

    // Crear examen
    const examResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('examTypeId', sql.Int, examTypeId)
      .input('attemptNumber', sql.Int, attemptNumber)
      .input('examLevelId', sql.Int, examLevelId)
      .query(`
        INSERT INTO Exams (user_id, exam_type_id, start_time, attempt_number, exam_level_id, is_completed)
        OUTPUT INSERTED.*
        VALUES (@userId, @examTypeId, DATEADD(day, -${attemptNumber * 2}, GETDATE()), @attemptNumber, @examLevelId, 0)
      `);
    const exam = examResult.recordset[0];

    // Obtener preguntas según el nivel del examen
    let questions;
    if (examLevelId) {
      // Para exámenes de práctica con nivel específico
      questions = await getRandomQuestions(pool, examLevelId, examType.total_questions);
    } else {
      // Para exámenes finales (todas las preguntas)
      const allQuestionsResult = await pool.request()
        .input('count', sql.Int, examType.total_questions)
        .query(`
          SELECT TOP (@count) question_id, correct_answer
          FROM Questions
          ORDER BY NEWID()
        `);
      questions = allQuestionsResult.recordset;
    }

    // Asignar preguntas al examen
    for (let i = 0; i < questions.length; i++) {
      await pool.request()
        .input('examId', sql.Int, exam.exam_id)
        .input('questionId', sql.Int, questions[i].question_id)
        .input('questionOrder', sql.Int, i + 1)
        .query(`
          INSERT INTO ExamQuestions (exam_id, question_id, question_order)
          VALUES (@examId, @questionId, @questionOrder)
        `);
    }

    // Calcular cuántas respuestas correctas necesitamos para el porcentaje objetivo
    const targetCorrect = Math.round((targetPercentage / 100) * questions.length);
    
    // Crear respuestas
    for (let i = 0; i < questions.length; i++) {
      const isCorrect = i < targetCorrect;
      const selectedAnswer = isCorrect ? questions[i].correct_answer : 
        (questions[i].correct_answer === 'a' ? 'b' : 'a'); // Respuesta incorrecta si no es correcta

      await pool.request()
        .input('examId', sql.Int, exam.exam_id)
        .input('questionId', sql.Int, questions[i].question_id)
        .input('selectedAnswer', sql.Char(1), selectedAnswer)
        .input('isCorrect', sql.Bit, isCorrect)
        .input('timeTaken', sql.Int, Math.floor(Math.random() * 50) + 10) // 10-60 segundos
        .query(`
          INSERT INTO UserAnswers (exam_id, question_id, selected_answer, is_correct, time_taken_seconds)
          VALUES (@examId, @questionId, @selectedAnswer, @isCorrect, @timeTaken)
        `);
    }

    // Calcular resultados
    const totalScore = targetCorrect * examType.points_per_question;
    const percentage = targetPercentage;
    const passed = percentage >= examType.passing_score;

    // Determinar nivel alcanzado basado en porcentaje
    const levelResult = await pool.request()
      .input('percentage', sql.Decimal(5, 2), percentage)
      .query(`
        SELECT level_id, level_name
        FROM Levels
        WHERE @percentage >= min_percentage AND @percentage <= max_percentage
      `);
    
    const levelAchievedId = levelResult.recordset.length > 0 ? levelResult.recordset[0].level_id : null;

    // Actualizar examen como completado
    await pool.request()
      .input('examId', sql.Int, exam.exam_id)
      .input('endTime', sql.DateTime, new Date(exam.start_time.getTime() + (questions.length * 45000))) // ~45 seg por pregunta
      .input('totalScore', sql.Decimal(5, 2), totalScore)
      .input('percentage', sql.Decimal(5, 2), percentage)
      .input('passed', sql.Bit, passed)
      .input('levelAchievedId', sql.Int, levelAchievedId)
      .query(`
        UPDATE Exams
        SET end_time = @endTime,
            total_score = @totalScore,
            percentage = @percentage,
            passed = @passed,
            level_achieved_id = @levelAchievedId,
            is_completed = 1
        WHERE exam_id = @examId
      `);

    // Actualizar nivel del usuario si pasó
    if (passed && levelAchievedId) {
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('levelId', sql.Int, levelAchievedId)
        .query(`
          UPDATE Users
          SET current_level_id = @levelId, updated_at = GETDATE()
          WHERE user_id = @userId
        `);
    }

    // Actualizar estadísticas del usuario
    const statsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM UserStatistics WHERE user_id = @userId');

    if (statsResult.recordset.length === 0) {
      // Crear estadísticas si no existen
      await pool.request()
        .input('userId', sql.Int, userId)
        .query('INSERT INTO UserStatistics (user_id) VALUES (@userId)');
    }

    // Actualizar estadísticas
    const examTypeName = examType.type_name;
    if (examTypeName === 'Practice') {
      await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          UPDATE UserStatistics
          SET total_practice_attempts = (SELECT COUNT(*) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Practice' AND e.is_completed = 1),
              best_practice_score = (SELECT MAX(percentage) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Practice' AND e.is_completed = 1),
              average_practice_score = (SELECT AVG(percentage) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Practice' AND e.is_completed = 1)
          WHERE user_id = @userId
        `);
    } else {
      await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          UPDATE UserStatistics
          SET total_final_attempts = (SELECT COUNT(*) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Final' AND e.is_completed = 1),
              best_final_score = (SELECT MAX(percentage) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Final' AND e.is_completed = 1),
              average_final_score = (SELECT AVG(percentage) FROM Exams e INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id WHERE e.user_id = @userId AND et.type_name = 'Final' AND e.is_completed = 1)
          WHERE user_id = @userId
        `);
    }

    // Actualizar totales generales
    await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        UPDATE UserStatistics
        SET total_questions_answered = (SELECT COUNT(*) FROM UserAnswers ua INNER JOIN Exams e ON ua.exam_id = e.exam_id WHERE e.user_id = @userId),
            total_correct_answers = (SELECT COUNT(*) FROM UserAnswers ua INNER JOIN Exams e ON ua.exam_id = e.exam_id WHERE e.user_id = @userId AND ua.is_correct = 1)
        WHERE user_id = @userId
      `);

    console.log(`✓ Examen creado para usuario ${userId}: ${examType.type_name}, ${percentage}%, ${passed ? 'PASSED' : 'FAILED'}`);
    return exam;
  } catch (error) {
    console.error('Error creando examen:', error);
    throw error;
  }
}

async function seedExams() {
  try {
    const pool = await getConnection();
    console.log('Conectado a SQL Server');
    console.log('Insertando exámenes de prueba...\n');

    // Obtener IDs necesarios
    const usersResult = await pool.request().query('SELECT user_id, username FROM Users WHERE username IN (\'juan_perez\', \'maria_lopez\', \'carlos_sanchez\')');
    const users = usersResult.recordset;

    const examTypesResult = await pool.request().query('SELECT exam_type_id, type_name FROM ExamTypes');
    const examTypes = {};
    examTypesResult.recordset.forEach(et => {
      examTypes[et.type_name] = et.exam_type_id;
    });

    const levelsResult = await pool.request().query('SELECT level_id, level_name FROM Levels');
    const levels = {};
    levelsResult.recordset.forEach(l => {
      levels[l.level_name] = l.level_id;
    });

    if (users.length === 0) {
      console.log('No se encontraron usuarios. Verifica que existan juan_perez, maria_lopez y carlos_sanchez');
      process.exit(1);
    }

    // USUARIO 1: juan_perez - Estudiante avanzado
    console.log('\n=== USUARIO 1: juan_perez (Estudiante Avanzado) ===');
    const user1 = users.find(u => u.username === 'juan_perez');
    if (user1) {
      // 3 Practice Básico (mejorando)
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Basico'], 65, 1);
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Basico'], 75, 2);
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Basico'], 85, 3);
      
      // 2 Practice Intermedio
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Intermedio'], 80, 1);
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Intermedio'], 88, 2);
      
      // 2 Practice Avanzado
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Avanzado'], 90, 1);
      await createCompletedExam(pool, user1.user_id, examTypes['Practice'], levels['Avanzado'], 92, 2);
      
      // 1 Final (aprobado con nivel avanzado)
      await createCompletedExam(pool, user1.user_id, examTypes['Final'], null, 91, 1);
    }

    // USUARIO 2: maria_lopez - Estudiante intermedio
    console.log('\n=== USUARIO 2: maria_lopez (Estudiante Intermedio) ===');
    const user2 = users.find(u => u.username === 'maria_lopez');
    if (user2) {
      // 4 Practice Básico (progreso moderado)
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Basico'], 55, 1);
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Basico'], 65, 2);
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Basico'], 70, 3);
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Basico'], 75, 4);
      
      // 3 Practice Intermedio
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Intermedio'], 72, 1);
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Intermedio'], 78, 2);
      await createCompletedExam(pool, user2.user_id, examTypes['Practice'], levels['Intermedio'], 82, 3);
      
      // 2 Final (primer intento fallido, segundo aprobado)
      await createCompletedExam(pool, user2.user_id, examTypes['Final'], null, 68, 1);
      await createCompletedExam(pool, user2.user_id, examTypes['Final'], null, 77, 2);
    }

    // USUARIO 3: carlos_sanchez - Estudiante básico
    console.log('\n=== USUARIO 3: carlos_sanchez (Estudiante Básico) ===');
    const user3 = users.find(u => u.username === 'carlos_sanchez');
    if (user3) {
      // 5 Practice Básico (dificultad para aprobar)
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Basico'], 45, 1);
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Basico'], 52, 2);
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Basico'], 58, 3);
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Basico'], 65, 4);
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Basico'], 68, 5);
      
      // 2 Practice Intermedio (reprobados)
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Intermedio'], 55, 1);
      await createCompletedExam(pool, user3.user_id, examTypes['Practice'], levels['Intermedio'], 62, 2);
      
      // 2 Final (ambos fallidos)
      await createCompletedExam(pool, user3.user_id, examTypes['Final'], null, 60, 1);
      await createCompletedExam(pool, user3.user_id, examTypes['Final'], null, 66, 2);
    }

    console.log('\n✅ Seed de exámenes completado exitosamente!');
    console.log('\nResumen:');
    console.log('- juan_perez: 7 Practice + 1 Final (Nivel Avanzado)');
    console.log('- maria_lopez: 7 Practice + 2 Final (Nivel Intermedio)');
    console.log('- carlos_sanchez: 7 Practice + 2 Final (Nivel Básico)');
    console.log('\nTotal: 28 exámenes completados');
    
    process.exit(0);
  } catch (error) {
    console.error('Error en seed de exámenes:', error);
    process.exit(1);
  }
}

seedExams();
