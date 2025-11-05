import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';

interface Level {
  level_id: number;
  level_name: string;
  description: string;
}

@Component({
  selector: 'app-exam-selection',
  template: `
    <div class="exam-selection-container">
      <div class="header">
        <button class="back-button" (click)="goBack()">
          <span>←</span> Back to Dashboard
        </button>
        <h1>Select Your Level</h1>
        <p class="subtitle">{{ examType === 'practice' ? 'Practice Exam' : 'Final Exam' }}</p>
      </div>

      <div class="levels-grid" *ngIf="!loading">
        <div 
          class="level-card" 
          *ngFor="let level of levels"
          (click)="selectLevel(level.level_id)"
        >
          <div class="level-header">
            <h2>{{ level.level_name }}</h2>
          </div>
          <div class="level-body">
            <p>{{ level.description }}</p>
          </div>
          <div class="level-footer">
            <button class="select-button">
              Start {{ examType === 'practice' ? 'Practice' : 'Final' }}
            </button>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading levels...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button (click)="loadLevels()">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .exam-selection-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 10px 20px;
      background: transparent;
      border: 2px solid #5c6bc0;
      color: #5c6bc0;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    }

    .back-button:hover {
      background: #5c6bc0;
      color: white;
    }

    .back-button span {
      font-size: 20px;
      margin-right: 5px;
    }

    h1 {
      color: #333;
      font-size: 36px;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #666;
      font-size: 18px;
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
      margin-top: 30px;
    }

    .level-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 25px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
    }

    .level-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(92, 107, 192, 0.2);
      border-color: #5c6bc0;
    }

    .level-header {
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }

    .level-header h2 {
      color: #5c6bc0;
      font-size: 24px;
      margin: 0;
    }

    .level-body {
      min-height: 60px;
      margin-bottom: 20px;
    }

    .level-body p {
      color: #666;
      line-height: 1.6;
    }

    .level-footer {
      text-align: center;
    }

    .select-button {
      width: 100%;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .select-button:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .loading, .error {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #666;
    }

    .error button {
      margin-top: 15px;
      padding: 10px 24px;
      background: #5c6bc0;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
  `]
})
export class ExamSelectionComponent implements OnInit {
  examType: string = 'practice';
  levels: Level[] = [];
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
    });
    this.loadLevels();
  }

  loadLevels() {
    this.loading = true;
    this.error = '';
    
    this.examService.getLevels().subscribe({
      next: (response: any) => {
        this.levels = response.data || response;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading levels:', err);
        this.error = 'Failed to load levels. Please try again.';
        this.loading = false;
      }
    });
  }

  selectLevel(levelId: number) {
    // Navegar a la página del examen con el nivel seleccionado
    this.router.navigate(['/exam'], {
      queryParams: {
        type: this.examType,
        level: levelId
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
