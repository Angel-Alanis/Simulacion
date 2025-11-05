import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Level, Question, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getAllLevels(): Observable<ApiResponse<Level[]>> {
    return this.http.get<ApiResponse<Level[]>>(`${this.apiUrl}/levels`);
  }

  getQuestionsByLevel(levelName: string): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.apiUrl}/level/${levelName}`);
  }

  getQuestionById(questionId: number): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.apiUrl}/${questionId}`);
  }

  getAllQuestions(): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(this.apiUrl);
  }
}
