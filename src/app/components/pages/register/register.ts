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
export class Register implements OnInit{
  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ]

  signupForm! : FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.signupForm.valid){
      this.isSubmitting = true;
      this.errorMessage = null;
      this.successMessage = null;
      console.log(this.signupForm.value);
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.updateAuthState(response.token, response.role, response.email);
          this.isSubmitting = false;
          this.showSuccess('Registration successful! Redirecting...');
          setTimeout(() => {
            this.route.navigate(['']);
          }, 1500); // Brief delay so the user can see the success toast
        },
        error: (error) => {
          console.error(error);
          this.showError(error.error?.message || 'Registration failed. Please try again later.');
          this.isSubmitting = false;
        }
      });
    }
  }

  showError(message: string) {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000); // Auto-hide after 5 seconds
    }

  showSuccess(message: string) {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 5000); // Auto-hide after 5 seconds
    }
}
