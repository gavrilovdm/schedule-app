import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AuthFormComponent, AuthCredentials } from '../../core/auth/auth-form.component';

@Component({
  selector: 'app-auth-page',
  template: `
    <div class="auth-container">
      <app-auth-form (formSubmit)="onSubmit($event)" [errorMessage]="error"></app-auth-form>
    </div>
  `,
  styleUrl: './auth-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AuthFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  onSubmit(credentials: AuthCredentials): void {
    const { email, password } = credentials;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/schedule']);
      },
      error: (err) => {
        this.error = err.error.message || 'Login failed';
        this.cdRef.detectChanges();
      }
    });
  }
} 