-- Agregar columna exam_level_id para distinguir el nivel del examen seleccionado
ALTER TABLE Exams
ADD exam_level_id INT NULL;

-- Agregar foreign key
ALTER TABLE Exams
ADD CONSTRAINT FK_Exams_ExamLevel 
FOREIGN KEY (exam_level_id) REFERENCES Levels(level_id);
