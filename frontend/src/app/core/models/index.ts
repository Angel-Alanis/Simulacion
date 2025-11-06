// User models
export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  name?: string; // Alias para fullName
  currentLevel?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  name?: string; // Alias para fullName
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Exam models
export interface ExamType {
  examTypeId: number;
  typeName: string;
  totalQuestions: number;
  maxAttempts: number;
  pointsPerQuestion: number;
  passingScore: number;
  timeLimitSeconds: number;
}

export interface Question {
  examQuestionId?: number;
  questionOrder?: number;
  questionId: number;
  questionText: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  levelName: string;
  hasContext: boolean;
  contextText?: string;
  imageUrl?: string;
}

export interface ExamSession {
  examId: number;
  examType: string;
  attemptNumber: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  timeLimitPerQuestion: number;
  questions: Question[];
}

export interface Answer {
  examId: number;
  questionId: number;
  selectedAnswer: string; // 'a', 'b', 'c', 'd', or 'x' for timeout
  timeTakenSeconds: number;
}

export interface ExamResult {
  examId: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalAnswers: number;
  levelAchieved?: string;
  message: string;
}

export interface ExamHistory {
  examId: number;
  startTime: string;
  endTime: string;
  totalScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  isCompleted: boolean;
  examType: string;
  levelAchieved?: string;
  score?: number; // Alias para percentage o totalScore
  date?: string; // Alias para startTime
}

// Level models
export interface Level {
  levelId: number;
  levelName: string;
  levelOrder: number;
  minQuestions: number;
  maxFailures: number;
  description: string;
}

// Statistics models
export interface UserStatistics {
  totalPracticeAttempts: number;
  totalFinalAttempts: number;
  bestPracticeScore: number;
  bestFinalScore: number;
  averagePracticeScore: number;
  averageFinalScore: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  accuracyPercentage: number;
  // Alias para compatibilidad con backend snake_case
  total_practice_attempts?: number;
  total_final_attempts?: number;
  best_practice_score?: number;
  best_final_score?: number;
  average_practice_score?: number;
  average_final_score?: number;
  total_questions_answered?: number;
  total_correct_answers?: number;
  accuracy_percentage?: number;
}

export interface DashboardStats {
  user?: User;
  userStatistics: UserStatistics;
  attemptsComparison: AttemptsComparison[];
  levelProgress: LevelProgress[];
  practiceBenefit: PracticeBenefit;
  recentHistory: ExamHistory[];
  averageTimePerQuestion: number;
  // Propiedades adicionales para compatibilidad
  totalExams?: number;
  averageScore?: number;
  bestScore?: number;
  recentExams?: ExamHistory[];
}

export interface AttemptsComparison {
  typeName: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  passedAttempts: number;
  // Alias para compatibilidad con backend snake_case
  type_name?: string;
  total_attempts?: number;
  average_score?: number;
  best_score?: number;
  passed_attempts?: number;
}

export interface LevelProgress {
  levelName: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

export interface PracticeBenefit {
  firstPracticeScore: number;
  firstFinalScore: number;
}

export interface ProgressCharts {
  progressOverTime: ProgressPoint[];
  answerDistribution: AnswerDistribution[];
  dates?: string[]; // Para gráficos
  scores?: number[]; // Para gráficos
}

export interface ProgressPoint {
  examId: number;
  startTime: string;
  percentage: number;
  passed: boolean;
  examType: string;
}

export interface AnswerDistribution {
  levelName: string;
  correct: number;
  incorrect: number;
}

export interface PracticeFinalAnalysis {
  totalPractices: number;
  avgPracticeScore: number;
  maxPracticeScore: number;
  passedPractices: number;
  totalFinals: number;
  avgFinalScore: number;
  maxFinalScore: number;
  passedFinals: number;
  scoreImprovement: number;
  practice?: any; // Para compatibilidad
  final?: any; // Para compatibilidad
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
