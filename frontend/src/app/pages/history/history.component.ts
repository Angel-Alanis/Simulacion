import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

interface ExamHistoryItem {
  exam_id: number;
  exam_type: string;
  start_time: string;
  end_time: string;
  percentage: number;
  passed: boolean;
  attempt_number: number;
  is_completed: boolean;
  level_achieved?: string;
}

@Component({
  selector: 'app-history',
  template: `
    <div class="history-container">
      <div class="header">
        <h1>📚 Exam History</h1>
        <button class="btn-back" (click)="goBack()">← Back to Dashboard</button>
      </div>

      <div class="history-content" *ngIf="!loading && !error">
        <div class="stats-summary" *ngIf="exams.length > 0">
          <div class="stat-box">
            <div class="stat-value">{{ exams.length }}</div>
            <div class="stat-label">Total Exams</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ getPassedCount() }}</div>
            <div class="stat-label">Passed</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ getAverageScore() }}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        </div>

        <div class="exams-list" *ngIf="exams.length > 0">
          <div 
            class="exam-card" 
            *ngFor="let exam of exams"
            [class.passed]="exam.passed"
            [class.failed]="!exam.passed && exam.is_completed"
            [class.incomplete]="!exam.is_completed"
            (click)="viewDetails(exam.exam_id)"
          >
            <div class="exam-header">
              <div class="exam-type">
                <span class="type-icon">{{ exam.exam_type === 'Practice' ? '📝' : '🎓' }}</span>
                <span class="type-name">{{ exam.exam_type }} Exam</span>
              </div>
              <div class="exam-status">
                <span class="status-badge" [class.passed]="exam.passed" [class.failed]="!exam.passed && exam.is_completed">
                  {{ exam.is_completed ? (exam.passed ? 'PASSED' : 'FAILED') : 'INCOMPLETE' }}
                </span>
              </div>
            </div>

            <div class="exam-body">
              <div class="exam-info">
                <div class="info-item">
                  <span class="info-icon">📊</span>
                  <span class="info-text">Score: <strong>{{ exam.percentage || 0 }}%</strong></span>
                </div>
                <div class="info-item">
                  <span class="info-icon">🔢</span>
                  <span class="info-text">Attempt: <strong>#{{ exam.attempt_number }}</strong></span>
                </div>
                <div class="info-item" *ngIf="exam.level_achieved">
                  <span class="info-icon">⭐</span>
                  <span class="info-text">Level: <strong>{{ exam.level_achieved }}</strong></span>
                </div>
              </div>

              <div class="exam-date">
                <span class="date-icon">📅</span>
                <span class="date-text">{{ formatDate(exam.start_time) }}</span>
              </div>
            </div>

            <div class="exam-footer">
              <button class="btn-view" (click)="viewDetails(exam.exam_id); $event.stopPropagation()">
                View Details →
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="exams.length === 0">
          <div class="empty-icon">📋</div>
          <h2>No Exams Yet</h2>
          <p>You haven't taken any exams yet. Start practicing now!</p>
          <button class="btn-primary" (click)="goBack()">Go to Dashboard</button>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading history...</p>
      </div>

      <div class="error-state" *ngIf="error">
        <h2>⚠️ Error</h2>
        <p>{{ error }}</p>
        <button class="btn-primary" (click)="loadHistory()">Try Again</button>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #333;
      font-size: 32px;
      margin: 0;
    }

    .btn-back {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    }

    .btn-back:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-box {
      background: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .exams-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .exam-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;
      border-left: 5px solid #e0e0e0;
    }

    .exam-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .exam-card.passed {
      border-left-color: #4caf50;
    }

    .exam-card.failed {
      border-left-color: #f44336;
    }

    .exam-card.incomplete {
      border-left-color: #ff9800;
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }

    .exam-type {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .type-icon {
      font-size: 24px;
    }

    .type-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .status-badge {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.passed {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.failed {
      background: #ffebee;
      color: #c62828;
    }

    .exam-body {
      margin-bottom: 15px;
    }

    .exam-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .info-icon {
      font-size: 18px;
    }

    .info-text strong {
      color: #333;
    }

    .exam-date {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #999;
      font-size: 14px;
    }

    .exam-footer {
      padding-top: 15px;
      border-top: 1px solid #f0f0f0;
    }

    .btn-view {
      width: 100%;
      padding: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-view:hover {
      transform: scale(1.02);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 25px;
    }

    .btn-primary {
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class HistoryComponent implements OnInit {
  exams: ExamHistoryItem[] = [];
  loading = true;
  error = '';

  constructor(
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.error = '';
    
    this.examService.getExamHistory().subscribe({
      next: (response: any) => {
        this.exams = response.data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading history:', err);
        this.error = 'Failed to load exam history';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPassedCount(): number {
    return this.exams.filter(e => e.passed).length;
  }

  getAverageScore(): number {
    if (this.exams.length === 0) return 0;
    const total = this.exams.reduce((sum, e) => sum + (e.percentage || 0), 0);
    return Math.round(total / this.exams.length);
  }

  viewDetails(examId: number) {
    this.router.navigate(['/result'], {
      queryParams: { examId }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
