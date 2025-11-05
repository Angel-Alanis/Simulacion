import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  DashboardStats,
  ProgressCharts,
  PracticeFinalAnalysis,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/statistics`);
  }

  getProgressCharts(): Observable<ApiResponse<ProgressCharts>> {
    return this.http.get<ApiResponse<ProgressCharts>>(`${this.apiUrl}/progress`);
  }

  getPracticeFinalAnalysis(): Observable<ApiResponse<PracticeFinalAnalysis>> {
    return this.http.get<ApiResponse<PracticeFinalAnalysis>>(`${this.apiUrl}/analysis`);
  }
}
