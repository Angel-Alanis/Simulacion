import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

interface ExamResult {
  examId: number;
  examType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  timeTaken: string;
  completedAt: string;
  passed: boolean;
  level?: string;
}

@Component({
  selector: 'app-result',
  template: `
    <div class="results-container" *ngIf="result && !loading">
      <!-- Success/Fail Banner -->
      <div class="result-banner" [class.passed]="result.passed" [class.failed]="!result.passed">
        <div class="banner-icon">{{ result.passed ? '🎉' : '📚' }}</div>
        <h1>{{ result.passed ? 'Congratulations!' : 'Keep Practicing!' }}</h1>
        <p>{{ result.passed ? 'You passed the exam!' : 'You can try again to improve your score.' }}</p>
      </div>

      <!-- Score Card -->
      <div class="score-card">
        <div class="score-circle" [class.passed]="result.passed">
          <div class="score-value">{{ result.score }}%</div>
          <div class="score-label">Final Score</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card correct">
          <div class="stat-icon">✓</div>
          <div class="stat-value">{{ result.correctAnswers }}</div>
          <div class="stat-label">Correct</div>
        </div>

        <div class="stat-card wrong">
          <div class="stat-icon">✗</div>
          <div class="stat-value">{{ result.wrongAnswers }}</div>
          <div class="stat-label">Wrong</div>
        </div>

        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-value">{{ result.totalQuestions }}</div>
          <div class="stat-label">Total Questions</div>
        </div>

        <div class="stat-card time">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">{{ result.timeTaken }}</div>
          <div class="stat-label">Time Taken</div>
        </div>
      </div>

      <!-- Exam Info -->
      <div class="exam-info">
        <h2>Exam Details</h2>
        <div class="info-row">
          <span class="info-label">Exam Type:</span>
          <span class="info-value">{{ result.examType }}</span>
        </div>
        <div class="info-row" *ngIf="result.level">
          <span class="info-label">Level:</span>
          <span class="info-value">{{ result.level }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Completed:</span>
          <span class="info-value">{{ formatDate(result.completedAt) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn btn-primary" (click)="goToDashboard()">
          Back to Dashboard
        </button>
        <button class="btn btn-secondary" (click)="viewHistory()">
          View History
        </button>
        <button class="btn btn-success" (click)="tryAgain()" *ngIf="!result.passed">
          Try Again
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading results...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" (click)="goToDashboard()">Back to Dashboard</button>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .result-banner {
      text-align: center;
      padding: 40px 20px;
      border-radius: 16px;
      margin-bottom: 30px;
      color: white;
    }

    .result-banner.passed {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    }

    .result-banner.failed {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    }

    .banner-icon {
      font-size: 64px;
      margin-bottom: 15px;
    }

    .result-banner h1 {
      margin: 0 0 10px 0;
      font-size: 36px;
    }

    .result-banner p {
      margin: 0;
      font-size: 18px;
      opacity: 0.95;
    }

    .score-card {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }

    .score-circle {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 8px solid #ff9800;
      position: relative;
    }

    .score-circle.passed {
      border-color: #4caf50;
    }

    .score-value {
      font-size: 56px;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }

    .score-label {
      font-size: 16px;
      color: #666;
      margin-top: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 36px;
      margin-bottom: 10px;
    }

    .stat-card.correct {
      border-left: 4px solid #4caf50;
    }

    .stat-card.wrong {
      border-left: 4px solid #f44336;
    }

    .stat-card.total {
      border-left: 4px solid #2196f3;
    }

    .stat-card.time {
      border-left: 4px solid #ff9800;
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .exam-info {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .exam-info h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 22px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #666;
      font-weight: 500;
    }

    .info-value {
      color: #333;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
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

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
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
export class ResultComponent implements OnInit {
  result: ExamResult | null = null;
  loading = true;
  error = '';
  examId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.examId = parseInt(params['examId']);
      if (this.examId) {
        this.loadResults();
      } else {
        this.error = 'No exam ID provided';
        this.loading = false;
      }
    });
  }

  loadResults() {
    this.loading = true;
    this.examService.getExamDetails(this.examId).subscribe({
      next: (response: any) => {
        const data = response.data;
        console.log('Exam data from backend:', data);
        
        // Mapear los datos del backend al formato esperado
        this.result = {
          examId: data.exam_id,
          examType: data.type_name,
          score: data.percentage || 0,
          totalQuestions: data.total_questions || 0,
          correctAnswers: data.correct_answers || 0,
          wrongAnswers: (data.total_questions || 0) - (data.correct_answers || 0),
          unansweredQuestions: 0,
          timeTaken: this.calculateTimeTaken(data.start_time, data.end_time),
          completedAt: data.end_time || data.start_time,
          passed: data.passed || false,
          level: data.level_achieved
        };
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading results:', err);
        this.error = 'Failed to load exam results';
        this.loading = false;
      }
    });
  }

  calculateTimeTaken(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return '0 min';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diff = Math.floor((end - start) / 1000); // segundos
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    return `${minutes}m ${seconds}s`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }

  tryAgain() {
    if (this.result) {
      this.router.navigate(['/exam-selection'], {
        queryParams: { type: this.result.examType.toLowerCase() }
      });
    }
  }
}
