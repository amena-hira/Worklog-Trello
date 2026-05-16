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

  @Output() profileUpdated = new EventEmitter<any>();

  // Using a setter dynamically watches for changes from the parent component
  @Input() 
  set userData(data: any) {
    this._userData = data;
    
    // If the form is already initialized, patch the new incoming data into it
    if (this.profileForm && data) {
      this.profileForm.patchValue({
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        email: data.email || '',
        gender: data.gender || ''
      });
    }
  }

  constructor(private fb: FormBuilder, private usersService: UsersService) {}

  ngOnInit(): void {
    // Initialize the form explicitly using FormControls
    this.profileForm = this.fb.group({
      first_name: new FormControl(this._userData?.firstName || '', [Validators.required]),
      last_name: new FormControl(this._userData?.lastName || '', [Validators.required]),
      email: new FormControl({ value: this._userData?.email || '', disabled: true }),
      gender: new FormControl(this._userData?.gender || '')
    });
  }

  closeModal() {
    const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
    modal?.close();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.getRawValue();
      console.log(updatedData);
      
      
      this.usersService.updateMe(updatedData).subscribe({
        next: (res) => {
          this.profileUpdated.emit(res);
          this.closeModal();
        },
        error: (err) => console.error('Error updating profile:', err)
      });
    }
  }

  
}