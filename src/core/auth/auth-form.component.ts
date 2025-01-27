import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject, ElementRef, ViewChild, DestroyRef, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AutofillMonitor } from '@angular/cdk/text-field';

export interface AuthCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-form',
  template: `
    <div class="form-container">
      <div class="auth-form-wrapper">
        <h2 class="form-title">Welcome Back</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput placeholder="Enter your email" formControlName="email" type="email" #inputEmail>
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="loginForm.get('email')?.errors?.['required']">
              Email is required
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.errors?.['email']">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'"
                   placeholder="Enter your password" formControlName="password" #inputPassword>
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button"
                    (click)="hidePassword = !hidePassword">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.errors?.['required']">
              Password is required
            </mat-error>
          </mat-form-field>

          <div *ngIf="errorMessage && errorMessage.length > 0" class="error-message">{{ errorMessage }}</div>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="loginForm.touched ? !loginForm.valid : !this.autoFilled"
                  class="submit-button">
            <mat-icon>login</mat-icon>
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrl: './auth-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent implements AfterViewInit {
  loginForm: FormGroup;
  autoFilled = false;
  private _autofill = inject(AutofillMonitor);

  @ViewChild('inputEmail') inputEmail!: ElementRef;
  @ViewChild('inputPassword') inputPassword!: ElementRef;

  @Input() errorMessage: string = '';

  @Output() formSubmit = new EventEmitter<AuthCredentials>();
  hidePassword = true;
  private destroyRef = inject(DestroyRef);


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // Workaround for the issue with the disabled button when the input is autofilled,
    // see more: https://github.com/angular/angular/issues/30616
    const emailSub = this._autofill.monitor(this.inputEmail).subscribe(e => this.autoFilled = e.isAutofilled);
    const passwordSub = this._autofill.monitor(this.inputPassword).subscribe(e => this.autoFilled = e.isAutofilled);

    this.destroyRef.onDestroy(() => {
      emailSub.unsubscribe();
      passwordSub.unsubscribe();
      this._autofill.stopMonitoring(this.inputEmail);
      this._autofill.stopMonitoring(this.inputPassword);
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.formSubmit.emit(this.loginForm.value);
    }
  }
}
