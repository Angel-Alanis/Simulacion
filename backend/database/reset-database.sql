-- Script para limpiar y recrear la base de datos
USE EnglishExamDB;
GO

-- Eliminar vistas
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_DashboardStats')
    DROP VIEW vw_DashboardStats;
GO

-- Eliminar tablas en orden inverso (respetando foreign keys)
IF OBJECT_ID('UserStatistics', 'U') IS NOT NULL DROP TABLE UserStatistics;
IF OBJECT_ID('ExamQuestions', 'U') IS NOT NULL DROP TABLE ExamQuestions;
IF OBJECT_ID('UserAnswers', 'U') IS NOT NULL DROP TABLE UserAnswers;
IF OBJECT_ID('Exams', 'U') IS NOT NULL DROP TABLE Exams;
IF OBJECT_ID('ExamTypes', 'U') IS NOT NULL DROP TABLE ExamTypes;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('Questions', 'U') IS NOT NULL DROP TABLE Questions;
IF OBJECT_ID('Levels', 'U') IS NOT NULL DROP TABLE Levels;
GO

PRINT 'Tablas eliminadas. Ejecute schema.sql para recrear la estructura.';
