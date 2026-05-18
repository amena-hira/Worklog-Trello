import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../service/users/users.service';
import { ProjectService } from '../../../../service/projects/project.service';

type Assignee = { id: number; name: string; avatar: string };

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.html',
  styleUrl: './add-project.css',
})
export class AddProject {
  @Input() editData: any = null;
  editId: number | null = null;
  selectedMembers: Assignee[] = [];
  searchTerm = '';
  filteredAssignees: Assignee[] = [];
  form!: FormGroup;

  showToast = false;
  toastMessage = '';
  isSubmitting = false;
  errorMessage: string | null = null;

  assignees: Assignee[] = [];

  todayDate = new Date().toISOString().split('T')[0];

  projectColors = ['sky', 'violet', 'fuchsia', 'green', 'teal', 'yellow', 'orange', 'blue'];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private projectService: ProjectService,
  ) {
    this.buildProjectForm(''); // Initialize the reactive form group
  }

  ngOnInit(): void {
    const currentUserEmail = sessionStorage.getItem('email') || ''; // Retrieve current user's email
    this.form.patchValue({ createdByUserEmail: currentUserEmail }); // Attach creator email to form

    this.fetchAssignees(); // Fetch available users for project members

    if (this.editData) {
      this.populateForm(this.editData); // Pre-fill the form for editing if project data is provided
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && !changes['editData'].isFirstChange()) { // React to changes in editData input
      if (this.editData) {
        this.populateForm(this.editData); // Populate form if new project data is passed
      } else {
        this.resetForm(); // Reset form for creating a new project
      }
    }
  }

  fetchAssignees(): void {
    this.usersService.getUsers().subscribe({
      next: (users: any[]) => {
        this.assignees = users
          .filter((user) => user.role === 'ROLE_USER')
          .map((user, index) => ({
            id: user?.id,
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            avatar: `https://i.pravatar.cc/150?u=${user.id || index}`,
          }));
        this.filteredAssignees = this.assignees;
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  buildProjectForm(currentUserEmail: string) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: [''],
      createdByUserEmail: [currentUserEmail],
      members: [[]],
      color: [''],
    });
  }

  private syncAssignees(): void {
    this.form.patchValue({
      members: this.selectedMembers.map((m) => ({ userId: m.id, role: 'MEMBER' })), // Format selected members into API payload structure
    });
  }

  populateForm(data: any): void {
    this.editId = data.id; // Store ID for updating an existing project
    const formattedDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ''; // Format dueDate for HTML input
    
    this.form.patchValue({ // Patch standard form fields
      name: data.name,
      description: data.description,
      dueDate: formattedDate,
      color: data.color || '',
    });
    if (data.members) {
      this.selectedMembers = data.members.map((m: any) => ({ // Reconstruct selected members from API data
        id: m.userId || m.id,
        name: m.userName || m.name,
        avatar: `https://i.pravatar.cc/150?u=${m.userId || m.id}`,
      }));
      this.syncAssignees(); // Update the form control with selected members
    }
  }

  resetForm(): void {
    this.editId = null; // Clear edit mode
    this.selectedMembers = []; // Reset selected assignees
    this.searchTerm = ''; // Clear search input
    this.form.reset({ // Clear form fields to prevent residual data leak
      name: '',
      description: '',
      dueDate: '',
      createdByUserEmail: sessionStorage.getItem('email') || '',
      members: [],
      color: '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { // Validate form before submission
      this.form.markAllAsTouched(); // Show visual errors for invalid fields
      return;
    }

    this.isSubmitting = true; // Set submission loading state
    this.errorMessage = null; // Clear previous errors
    const payload = { ...this.form.value, id: this.editId }; // Merge form values with edit ID

    const request = this.editId
      ? this.projectService.updateProject(payload) // Update existing project
      : this.projectService.createProject(this.form.value); // Create new project

    request.subscribe({
      next: (res) => {
        this.displayToast(this.form.value.name, this.editId ? 'updated' : 'created'); // Show success notification
        this.resetForm(); // Clear the form
        (document.getElementById('add_project') as HTMLDialogElement)?.close(); // Automatically close the modal
        this.isSubmitting = false; // Reset submission loading state
      },
      error: (err) => {
        console.error('Error saving project:', err); // Log error if submission fails
        this.errorMessage = err.error?.message || 'An unexpected error occurred while saving the project.'; // Display error message
        this.isSubmitting = false; // Reset submission loading state
      },
    });
  }

  private displayToast(name: string, action: string) {
    // Display a success notification
    this.toastMessage = `"${name}" was ${action} successfully project!`;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hides the toast after 3 seconds
  }

  onSearchInput(event: Event): void {
    // Filter the assignees list based on user search input
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredAssignees = this.assignees.filter((member) =>
      member.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  onSelectMember(member: Assignee): void {
    // Toggle member selection
    const exists = this.selectedMembers.some((m) => m.id === member.id);

    this.selectedMembers = exists
      ? this.selectedMembers.filter((m) => m.id !== member.id)
      : [...this.selectedMembers, member];

    this.syncAssignees();
  }

  isSelected(member: Assignee): boolean {
    // Check if a member is currently selected
    return this.selectedMembers.some((m) => m.id === member.id);
  }

  onRemoveSelectMember(member: Assignee): void {
    // Remove a member from the selected list
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
    this.syncAssignees();
  }
}
