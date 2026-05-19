import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { TaskService } from '../../../service/tasks/task.service';
import { ProjectService } from '../../../service/projects/project.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public authService: AuthService,
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);

    if (!control || !(control.touched || control.dirty) || !control.errors) {
      return null;
    }

    const fieldNames: Record<string, string> = {
      email: 'Email',
      password: 'Password',
    };

    const fieldName = fieldNames[controlName];

    if (control.errors['required']) {
      return `${fieldName} is required`;
    }

    if (control.errors['email'] || control.errors['pattern']) {
      return 'Please enter a valid email address';
    }

    if (control.errors['minlength']) {
      return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    return null;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.updateAuthState(response.token, response.role, response.email);
        this.taskService.clearCache();
        this.projectService.clearCache();
        this.isSubmitting = false;
        this.showSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          if (response.role === 'ROLE_ADMIN') {
            this.route.navigate(['/admin/dashboard']);
          } else {
            this.route.navigate(['']);
          }
        }, 1500);
      },
      error: (error) => {
        this.showError(error.error?.message || 'An unexpected error occurred while logging in.');
        this.isSubmitting = false;
      },
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 5000); // Auto-hide after 5 seconds
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = null), 5000); // Auto-hide after 5 seconds
  }
}
