import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DashboardService } from '@core/services/dashboard.service';
import { User, DashboardStats } from '@core/models';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats | null = null;
  loading = true;

  // Chart configurations
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Score Progress Over Time'
      }
    }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };
  
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Practice vs Final Exam Performance'
      }
    }
  };

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getStatistics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
          
          // Mapear historial reciente
          if (this.stats.recentHistory) {
            this.stats.recentExams = this.stats.recentHistory;
          }
          
          // Calcular estadísticas totales
          if (this.stats.userStatistics) {
            const us = this.stats.userStatistics;
            this.stats.totalExams = (us.total_practice_attempts || 0) + (us.total_final_attempts || 0);
            
            // Promedio ponderado de puntajes
            const practiceTotal = (us.average_practice_score || 0) * (us.total_practice_attempts || 0);
            const finalTotal = (us.average_final_score || 0) * (us.total_final_attempts || 0);
            const totalAttempts = (us.total_practice_attempts || 0) + (us.total_final_attempts || 0);
            this.stats.averageScore = totalAttempts > 0 ? Math.round((practiceTotal + finalTotal) / totalAttempts) : 0;
            
            // Mejor puntaje obtenido
            this.stats.bestScore = Math.max(us.best_practice_score || 0, us.best_final_score || 0);
          }
          
          this.loadCharts();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  loadCharts(): void {
    // Cargar gráfica de progreso
    this.dashboardService.getProgressCharts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Convertir datos de progreso a formato de gráfica
          const progressData = response.data.progressOverTime || [];
          const dates = progressData.map((item: any) => {
            const date = new Date(item.start_time);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          const scores = progressData.map((item: any) => item.percentage || 0);
          
          this.lineChartData = {
            labels: dates,
            datasets: [{
              data: scores,
              label: 'Score',
              fill: false,
              tension: 0.1,
              borderColor: '#3f51b5',
              backgroundColor: 'rgba(63, 81, 181, 0.1)'
            }]
          };
        }
      },
      error: (error: any) => console.error('Error loading progress chart:', error)
    });

    // Cargar análisis de práctica vs final
    if (this.stats?.attemptsComparison) {
      const practiceData = this.stats.attemptsComparison.find((a) => a.type_name === 'Practice');
      const finalData = this.stats.attemptsComparison.find((a) => a.type_name === 'Final');
      
      const practice = {
        avgScore: practiceData?.average_score || 0,
        bestScore: practiceData?.best_score || 0,
        totalAttempts: practiceData?.total_attempts || 0
      };
      
      const final = {
        avgScore: finalData?.average_score || 0,
        bestScore: finalData?.best_score || 0,
        totalAttempts: finalData?.total_attempts || 0
      };
      
      this.barChartData = {
        labels: ['Average Score', 'Best Score', 'Attempts'],
        datasets: [
          {
            data: [practice.avgScore, practice.bestScore, practice.totalAttempts],
            label: 'Practice Exams',
            backgroundColor: '#4caf50'
          },
          {
            data: [final.avgScore, final.bestScore, final.totalAttempts],
            label: 'Final Exams',
            backgroundColor: '#f44336'
          }
        ]
      };
    }
  }

  startPracticeExam(): void {
    this.router.navigate(['/exam-selection'], { queryParams: { type: 'practice' } });
  }

  startFinalExam(): void {
    this.router.navigate(['/exam-selection'], { queryParams: { type: 'final' } });
  }

  viewHistory(): void {
    this.router.navigate(['/history']);
  }

  logout(): void {
    this.authService.logout();
  }
}
