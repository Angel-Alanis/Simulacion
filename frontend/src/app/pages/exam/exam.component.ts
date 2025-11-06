import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

interface Question {
  examQuestionId: number;
  questionOrder: number;
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
  selectedAnswer?: string;
}

interface ExamSession {
  examId: number;
  examType: string;
  attemptNumber: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  timeLimitPerQuestion: number;
  questions: Question[];
}

@Component({
  selector: 'app-exam',
  template: `
    <div class="exam-container" *ngIf="examSession">
      <!-- Header -->
      <div class="exam-header">
        <div class="header-left">
          <h1>{{ examSession.examType }} Exam</h1>
          <p>Attempt {{ examSession.attemptNumber }} | Level: {{ getCurrentQuestion()?.levelName }}</p>
        </div>
        <div class="header-right">
          <div class="timer" [class.warning]="isTimerWarning()">
            <span class="timer-icon">⏱️</span>
            <span class="timer-text">{{ formatTime(timeRemaining) }}</span>
          </div>
          <div class="progress-info">
            Question {{ currentQuestionIndex + 1 }} / {{ examSession.totalQuestions }}
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
      </div>

      <!-- Question Content -->
      <div class="question-section" *ngIf="getCurrentQuestion() as question">
        <!-- Context if available -->
        <div class="context-box" *ngIf="question.hasContext && question.contextText">
          <h3>📖 Context:</h3>
          <p>{{ question.contextText }}</p>
        </div>

        <!-- Image if available -->
        <div class="image-box" *ngIf="question.imageUrl">
          <img [src]="question.imageUrl" [alt]="'Question ' + question.questionOrder" />
        </div>

        <!-- Question Text -->
        <div class="question-text">
          <h2>{{ currentQuestionIndex + 1 }}. {{ question.questionText }}</h2>
        </div>

        <!-- Options -->
        <div class="options-container">
          <div 
            class="option-card" 
            *ngFor="let opt of getOptionsArray(question.options)"
            [class.selected]="question.selectedAnswer === opt.key"
            (click)="selectAnswer(opt.key)"
          >
            <div class="option-letter">{{ opt.key.toUpperCase() }}</div>
            <div class="option-text">{{ opt.value }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <button 
          class="btn btn-secondary" 
          (click)="previousQuestion()"
          [disabled]="currentQuestionIndex === 0"
        >
          ← Previous
        </button>
        
        <button 
          class="btn btn-primary" 
          *ngIf="currentQuestionIndex < examSession.totalQuestions - 1"
          (click)="nextQuestion()"
          [disabled]="!getCurrentQuestion()?.selectedAnswer"
        >
          Next →
        </button>

        <button 
          class="btn btn-success" 
          *ngIf="currentQuestionIndex === examSession.totalQuestions - 1"
          (click)="finishExam()"
          [disabled]="!isExamComplete()"
        >
          Finish Exam ✓
        </button>
      </div>

      <!-- Question Navigator -->
      <div class="question-navigator">
        <h3>Question Navigator:</h3>
        <div class="navigator-grid">
          <button
            *ngFor="let q of examSession.questions; let i = index"
            class="nav-question"
            [class.current]="i === currentQuestionIndex"
            [class.answered]="q.selectedAnswer"
            (click)="goToQuestion(i)"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading exam...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" (click)="goBack()">Back to Dashboard</button>
    </div>
  `,
  styles: [`
    .exam-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .header-left h1 {
      margin: 0 0 5px 0;
      font-size: 28px;
    }

    .header-left p {
      margin: 0;
      opacity: 0.9;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }

    .timer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      font-weight: bold;
      padding: 10px 20px;
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
    }

    .timer.warning {
      background: #ff5252;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .progress-info {
      font-size: 14px;
      opacity: 0.9;
    }

    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .question-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .context-box {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #667eea;
    }

    .context-box h3 {
      margin: 0 0 10px 0;
      color: #667eea;
    }

    .image-box {
      text-align: center;
      margin: 20px 0;
    }

    .image-box img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .question-text {
      margin-bottom: 30px;
    }

    .question-text h2 {
      color: #333;
      font-size: 22px;
      line-height: 1.6;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .option-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      background: white;
    }

    .option-card:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .option-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .option-letter {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }

    .option-card.selected .option-letter {
      background: white;
      color: #667eea;
    }

    .option-text {
      flex: 1;
      font-size: 16px;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 30px;
    }

    .btn {
      padding: 15px 40px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #d0d0d0;
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }

    .question-navigator {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .question-navigator h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 18px;
    }

    .navigator-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 10px;
    }

    .nav-question {
      width: 50px;
      height: 50px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .nav-question:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .nav-question.current {
      border-color: #667eea;
      background: #667eea;
      color: white;
    }

    .nav-question.answered {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }

    .nav-question.answered.current {
      background: #667eea;
      border-color: #667eea;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ExamComponent implements OnInit, OnDestroy {
  examType: string = '';
  levelId: number = 0;
  examSession: ExamSession | null = null;
  currentQuestionIndex = 0;
  timeRemaining = 0;
  timerInterval: any;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.examType = params['type'] || 'practice';
      this.levelId = parseInt(params['level']) || 1;
      this.startExam();
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startExam() {
    this.loading = true;
    this.error = '';

    const examTypeCapitalized = this.examType.charAt(0).toUpperCase() + this.examType.slice(1);
    
    this.examService.startExam(examTypeCapitalized as 'Practice' | 'Final', this.levelId).subscribe({
      next: (response: any) => {
        this.examSession = response.data;
        this.timeRemaining = this.examSession!.timeLimitPerQuestion;
        this.startTimer();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error starting exam:', err);
        this.error = err.error?.message || 'Failed to start exam. Please try again.';
        this.loading = false;
      }
    });
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        // Auto-advance to next question when time runs out
        if (this.currentQuestionIndex < this.examSession!.totalQuestions - 1) {
          this.nextQuestion();
        }
      }
    }, 1000);
  }

  getCurrentQuestion(): Question | undefined {
    return this.examSession?.questions[this.currentQuestionIndex];
  }

  getOptionsArray(options: any): Array<{key: string, value: string}> {
    return Object.keys(options).map(key => ({
      key,
      value: options[key]
    }));
  }

  selectAnswer(answer: string) {
    const question = this.getCurrentQuestion();
    if (question) {
      question.selectedAnswer = answer;
      
      // Enviar respuesta al backend inmediatamente
      const timeTaken = this.examSession!.timeLimitPerQuestion - this.timeRemaining;
      
      this.examService.submitAnswer({
        examId: this.examSession!.examId,
        questionId: question.questionId,
        selectedAnswer: answer,
        timeTakenSeconds: timeTaken
      }).subscribe({
        next: (response: any) => {
          console.log('Answer submitted:', response);
        },
        error: (err: any) => {
          console.error('Error submitting answer:', err);
        }
      });
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.examSession!.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.timeRemaining = this.examSession!.timeLimitPerQuestion;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.timeRemaining = this.examSession!.timeLimitPerQuestion;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.timeRemaining = this.examSession!.timeLimitPerQuestion;
  }

  isExamComplete(): boolean {
    return this.examSession?.questions.every(q => q.selectedAnswer) || false;
  }

  getProgressPercentage(): number {
    if (!this.examSession) return 0;
    return ((this.currentQuestionIndex + 1) / this.examSession.totalQuestions) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  isTimerWarning(): boolean {
    return this.timeRemaining <= 10;
  }

  finishExam() {
    if (!this.isExamComplete()) {
      alert('Please answer all questions before finishing the exam.');
      return;
    }

    if (confirm('Are you sure you want to finish the exam? You cannot change your answers after submission.')) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      this.examService.finishExam(this.examSession!.examId).subscribe({
        next: (response: any) => {
          this.router.navigate(['/result'], {
            queryParams: { examId: this.examSession!.examId }
          });
        },
        error: (err: any) => {
          console.error('Error finishing exam:', err);
          alert('Error finishing exam. Please try again.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
