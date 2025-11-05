import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  ExamSession,
  Answer,
  ExamResult,
  ExamHistory,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getLevels(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/questions/levels`);
  }

  startExam(examType: 'Practice' | 'Final'): Observable<ApiResponse<ExamSession>> {
    return this.http.post<ApiResponse<ExamSession>>(`${this.apiUrl}/start`, { examType });
  }

  submitAnswer(answer: Answer): Observable<ApiResponse<{ answerId: number; isCorrect: boolean }>> {
    return this.http.post<ApiResponse<{ answerId: number; isCorrect: boolean }>>(
      `${this.apiUrl}/answer`,
      answer
    );
  }

  finishExam(examId: number): Observable<ApiResponse<ExamResult>> {
    return this.http.post<ApiResponse<ExamResult>>(`${this.apiUrl}/finish`, { examId });
  }

  getExamHistory(): Observable<ApiResponse<ExamHistory[]>> {
    return this.http.get<ApiResponse<ExamHistory[]>>(`${this.apiUrl}/history`);
  }

  getExamDetails(examId: number): Observable<ApiResponse<ExamHistory>> {
    return this.http.get<ApiResponse<ExamHistory>>(`${this.apiUrl}/${examId}`);
  }
}
