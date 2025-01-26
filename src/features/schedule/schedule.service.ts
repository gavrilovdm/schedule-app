import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { API_URL } from '../../shared/config/api.config';
import { IDaySchedule, IScheduleResponse } from '../../shared/models/schedule.model';

@Injectable()
export class ScheduleService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getUserIdHeaders(): HttpHeaders {
    const userId = this.authService.getCurrentUserId();
    return new HttpHeaders().set('userId', userId?.toString() || '');
  }

  getSchedule(): Observable<undefined | IDaySchedule[]> {
    return this.http.get(`${API_URL}/schedule`, { headers: this.getUserIdHeaders() })
      .pipe(
        map((response: IScheduleResponse) => response.schedule && response.schedule),
        catchError((error) => {
          console.error('Error getting schedule:', error.error.message);
          return of(undefined);
        })
      );
  }

  toggleBookng(day: string, time: number): Observable<boolean> {
    const body = { day, time };
    
    return this.http.patch(`${API_URL}/schedule`, body, { headers: this.getUserIdHeaders() })
      .pipe(
        map((response: IScheduleResponse) => !!response.success),
        catchError((error) => {
          console.error('Error toggling booking:', error.error.message);
          return of(false);
        })
      );
  }
}
