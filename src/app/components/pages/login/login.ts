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
  loginForm! : FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private fb:FormBuilder, private route:Router, public authService: AuthService, private taskService: TaskService, private projectService:ProjectService){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.isSubmitting = true;
      this.errorMessage = null;
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.updateAuthState(response.token, response.role, response.email);
          this.taskService.clearCache();
          this.projectService.clearCache();
          this.isSubmitting = false;
          if(response.role === 'ROLE_ADMIN'){
            this.route.navigate(['/admin/dashboard']);
          } else {
            this.route.navigate(['']);
          }
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
