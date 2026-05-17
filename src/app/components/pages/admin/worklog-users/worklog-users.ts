import { Component, ViewChild } from '@angular/core';
import { UsersService } from '../../../../service/users/users.service';
import { FormDelete } from '../../../common/form-delete/form-delete';

@Component({
  selector: 'app-worklog-users',
  standalone: false,
  templateUrl: './worklog-users.html',
  styleUrl: './worklog-users.css',
})
export class WorklogUsers {
  users: any[] = [];
  loading: boolean = true;
  selectedUser: any = null;
  isAddMode: boolean = false;
  errorMessage: string | null = null;

  @ViewChild(FormDelete) deleteModal!: FormDelete;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.errorMessage = null;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError(err.error?.message || 'An unexpected error occurred while fetching users.');
      },
    });
  }

  openCreateModal() {
    this.isAddMode = true;
    this.selectedUser = null;
    const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  openEditModal(user: any) {
    this.isAddMode = false;
    this.selectedUser = user;
    const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  openDeleteModal(user: any) {
    // Ensure the item has a 'name' property so the form-delete modal can display it
    const itemToDelete = { ...user, name: user.name || (user.first_name ? user.first_name + ' ' + user.last_name : 'Unknown User') };
    this.deleteModal.open(itemToDelete);
  }

  onUserDeleted(user: any) {
    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.fetchUsers(); // Refresh the list after successful deletion
      },
      error: (err) => {
        this.showError(err.error?.message || 'An unexpected error occurred while deleting the user.');
      },
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 5000); // Auto-hide after 5 seconds
  }
}
