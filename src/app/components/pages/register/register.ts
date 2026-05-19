import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
  ];

  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', [Validators.required]],
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.signupForm.get(controlName);

    if (!control || !(control.touched || control.dirty) || !control.errors) {
      return null;
    }

    const fieldNames: Record<string, string> = {
      first_name: 'First name',
      last_name: 'Last name',
      email: 'Email',
      password: 'Password',
      gender: 'Gender',
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
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.signup(this.signupForm.value).subscribe({
      next: (response) => {
        this.authService.updateAuthState(response.token, response.role, response.email);
        this.isSubmitting = false;
        this.showSuccess('Registration successful! Redirecting...');

        setTimeout(() => {
          this.route.navigate(['']);
        }, 1500);
      },
      error: (error) => {
        console.log(error);
        this.showError(error.error || 'Registration failed. Please try again later.');
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
