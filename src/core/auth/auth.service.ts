import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IUser, IUserResponse } from '../../shared/models/user.model';
import { API_URL } from '../../shared/config/api.config';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'currentUser';
  private currentUserSubject: BehaviorSubject<IUser | null>;
  currentUser$: Observable<IUser | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    this.currentUserSubject = new BehaviorSubject<IUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<IUser> {
    return this.http.post<IUserResponse>(`${API_URL}/login`, { email, password })
      .pipe(
        map(response => {
          if (response.user) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            return response.user;
          }
          throw new Error('Login failed');
        })
      );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
} 