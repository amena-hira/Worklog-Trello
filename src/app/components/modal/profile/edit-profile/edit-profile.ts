import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../service/users/users.service';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css' // Or whatever stylesheet you use
})
export class EditProfile implements OnInit {
  
  profileForm!: FormGroup;
  private _userData: any = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;

  @Output() profileUpdated = new EventEmitter<any>();

  @Input() isAddMode: boolean = false;

  get isAdmin(): boolean {
    return sessionStorage.getItem('authRole') === 'ROLE_ADMIN';
  }

  get canEditEmail(): boolean {
    return this.isAddMode || this.isAdmin;
  }

  // Using a setter dynamically watches for changes from the parent component
  @Input() 
  set userData(data: any) {
    this._userData = data;
    this.errorMessage = null; // Reset errors when switching modes/users
    
    // Helper to ensure gender case matches radio button values ('male', 'female')
    const formattedGender = data?.gender 
      ? data.gender.toLowerCase() 
      : '';

    // If the form is already initialized, patch the new incoming data into it
    if (this.profileForm) {
      if (data) {
        this.profileForm.patchValue({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          gender: formattedGender,
          role: data.role || 'USER'
        });
        if (!this.canEditEmail) {
          this.profileForm.get('email')?.disable();
        } else {
          this.profileForm.get('email')?.enable();
        }
      } else {
        this.profileForm.reset();
        if (this.canEditEmail) {
          this.profileForm.get('email')?.enable();
        }
      }
    }
  }

  constructor(private fb: FormBuilder, private usersService: UsersService) {}

  ngOnInit(): void {
    const initialGender = this._userData?.gender 
      ? this._userData.gender.toLowerCase() 
      : '';

    // Initialize the form explicitly using FormControls
    this.profileForm = this.fb.group({
      first_name: new FormControl(this._userData?.first_name || '', [Validators.required]),
      last_name: new FormControl(this._userData?.last_name || '', [Validators.required]),
      email: new FormControl({ value: this._userData?.email || '', disabled: !this.canEditEmail }, [Validators.required, Validators.email]),
      gender: new FormControl(initialGender),
      role: new FormControl(this._userData?.role || 'ROLE_USER')
    });
  }

  closeModal() {
    const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
    modal?.close();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.getRawValue();
      this.errorMessage = null; // Clear previous errors
      this.isSubmitting = true;
      console.log(updatedData);
      
      if (this.isAdmin && this.isAddMode) {
        // Admin adding a new user
        const payload = { ...updatedData, password: '123456' };
        this.usersService.addUser(payload).subscribe({
          next: (res) => {
            this.profileUpdated.emit(res);
            this.isSubmitting = false;
            this.closeModal();
          },
          error: (err) => {
            console.error('Error creating user:', err);
            this.errorMessage = err.error?.message || 'An unexpected error occurred while creating the user.';
            this.isSubmitting = false;
          }
        });
      } else if (this.isAdmin && !this.isAddMode) {
        // Admin updating an existing user
        const payload = { ...updatedData, id: this._userData?.id };
        console.log(payload, this._userData?.id)
        this.usersService.updateUser(payload).subscribe({
          next: (res) => {
            this.profileUpdated.emit(res);
            this.isSubmitting = false;
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.errorMessage = err.error?.message || 'An unexpected error occurred while updating the user.';
            this.isSubmitting = false;
          }
        });
      } else {
        // Normal user updating their own profile
        this.usersService.updateMe(updatedData).subscribe({
          next: (res) => {
            this.profileUpdated.emit(res);
            this.isSubmitting = false;
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating profile:', err);
            this.errorMessage = err.error?.message || 'An unexpected error occurred while updating your profile.';
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  
}