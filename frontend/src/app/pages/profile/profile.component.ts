import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>👤 User Profile</h1>
        <button class="btn-back" (click)="goBack()">← Back to Dashboard</button>
      </div>

      <div class="profile-content" *ngIf="user">
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar">
              {{ getInitials() }}
            </div>
            <h2>{{ user.fullName || user.name || 'User' }}</h2>
            <p class="user-level">Level: {{ user.currentLevel || 'Not determined' }}</p>
          </div>

          <div class="info-section">
            <h3>Account Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">📧 Email:</span>
                <span class="value">{{ user.email || user.username }}</span>
              </div>
              <div class="info-item">
                <span class="label">👤 Username:</span>
                <span class="value">{{ user.username }}</span>
              </div>
              <div class="info-item">
                <span class="label">📅 Member Since:</span>
                <span class="value">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="actions-section">
            <button class="btn btn-primary" (click)="viewHistory()">
              📚 View Exam History
            </button>
            <button class="btn btn-secondary" (click)="goToDashboard()">
              🏠 Go to Dashboard
            </button>
            <button class="btn btn-danger" (click)="logout()">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
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

    .profile-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .avatar-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 40px 20px;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: white;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      margin: 0 auto 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .avatar-section h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
    }

    .user-level {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .info-section {
      padding: 30px;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-section h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9ff;
      border-radius: 8px;
    }

    .label {
      font-weight: 600;
      color: #666;
    }

    .value {
      color: #333;
      font-weight: 500;
    }

    .actions-section {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
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
      background: #4caf50;
      color: white;
    }

    .btn-secondary:hover {
      background: #45a049;
      transform: translateY(-2px);
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background: #d32f2f;
      transform: translateY(-2px);
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
  }

  getInitials(): string {
    if (this.user?.fullName || this.user?.name) {
      const name = this.user.fullName || this.user.name;
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[0][0] + parts[1][0];
      }
      return name.substring(0, 2);
    }
    return this.user?.username?.substring(0, 2).toUpperCase() || 'U';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
