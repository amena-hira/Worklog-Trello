import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private route: Router
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
      console.log(this.signupForm.value);
      this.route.navigate(['/']);
    }
  }
}
