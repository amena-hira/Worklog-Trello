import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../../service/projects/project.service';
import { TaskService } from '../../../../service/tasks/task.service';

type Assignee = { id: number; name: string; avatar: string };

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnInit, OnChanges {
  @Input() editData: any = null;
  editId: number | null = null;

  title = '';

  // Assignee selection properties
  assignees: Assignee[] = [];
  selectedMembers: Assignee[] = [];
  searchTerm = '';
  filteredAssignees: Assignee[] = [];

  // Reactive form group
  form!: FormGroup;

  // Project data
  projects: any[] = [];
  selectedProjectDueDate: string = '';

  // Used for setting minimum due date
  todayDate = new Date().toISOString().split('T')[0];

  // Form submission state
  isSubmitting = false;

  // Notification states
  errorMessage: string | null = null;
  showToast = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {
    this.buildTaskForm('');
  }

  ngOnInit(): void {
    const currentUserEmail = sessionStorage.getItem('email') || ''; // Retrieve current user's email to attach as creator
    this.form.patchValue({ createdByUserEmail: currentUserEmail }); // Attach creator email to form
    this.fetchProjects(); // Fetch the list of available projects for the dropdown

    if (this.editData) {
      this.populateForm(this.editData); // Pre-fill the form for editing if task data is provided
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && !changes['editData'].isFirstChange()) { // React to changes in editData input
      if (this.editData) {
        this.populateForm(this.editData); // Populate form if new task data is passed
      } else {
        this.resetForm(); // Reset form for creating a new task if data is cleared
      }
    }
  }

  buildTaskForm(currentUserEmail: string) {
    this.form = this.fb.group({ // Initialize the reactive form group with validation
      name: ['', Validators.required],
      description: [''],
      priority: [''],
      isCompleted: [false],
      dueDate: [''],
      projectId: ['', Validators.required],
      createdByUserEmail: [currentUserEmail],
      assignees: [[]],
    });

    this.form.get('projectId')?.valueChanges.subscribe((projectId) => { // Listen for project selection changes
      this.updateProjectDetails(projectId); // Update assignees and due date based on selected project
    });
  }

  populateForm(data: any): void {
    this.editId = data.id; // Store ID for updating an existing task
    const formattedDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ''; // Format dueDate for HTML input

    this.form.patchValue({ // Patch standard form fields
      name: data.name,
      description: data.description,
      priority: data.priority,
      isCompleted: data.isCompleted,
      dueDate: formattedDate,
      projectId: data.projectId || '',
    });

    if (data.assignees) {
      this.selectedMembers = data.assignees.map((a: any) => ({ // Reconstruct selected members from API data
        id: a?.userId || a.id,
        name: a.userName || a.name,
        avatar: a.avatarUrl || `https://i.pravatar.cc/150?u=${a.userId || a.id}`,
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
      priority: '',
      isCompleted: false,
      dueDate: '',
      projectId: '',
      createdByUserEmail: sessionStorage.getItem('email') || '',
      assignees: [],
    });
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({ // Retrieve all projects from the backend
      next: (projects) => {
        const currentUserEmail = sessionStorage.getItem('email');

        this.projects = projects.filter((project) => { // Filter projects client-side based on user access
          if (!currentUserEmail) return true;
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some(
            (m: any) => m.userEmail === currentUserEmail,
          );
          return isCreator || isMember;
        });

        const currentProjectId = this.form.get('projectId')?.value;
        if (currentProjectId) {
          this.updateProjectDetails(currentProjectId); // Update details if a project is already selected
        }
      },
      error: (err) => {
        console.error('Error fetching projects:', err); // Log error if fetching fails
        this.showError(err?.error?.message || 'An unexpected error occurred while fetching projects.');
      },
    });
  }

  private updateProjectDetails(projectId: any): void {
    const selectedProject = this.projects.find((p) => p.id == projectId); // Locate selected project
    
    if (selectedProject) {
      this.selectedProjectDueDate = selectedProject.dueDate // Format and expose project deadline
        ? new Date(selectedProject.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })
        : '';

      this.assignees = (selectedProject.members || []).map((m: any, index: number) => ({ // Map project members to selectable assignees
        id: m.userId || m.id || index + 1,
        name: m.userName || m.name,
        avatar: m.avatarUrl || `https://i.pravatar.cc/150?u=${m.userId || m.id || index}`,
      }));
    } else {
      this.selectedProjectDueDate = ''; // Clear due date if no project selected
      this.assignees = []; // Clear assignees if no project selected
    }

    this.filteredAssignees = this.assignees; // Reset search filter
    this.selectedMembers = this.selectedMembers.filter((sm) => // Unselect members who don't belong to the new project
      this.assignees.some((a) => a.id === sm.id),
    );
    this.syncAssignees(); // Synchronize form control
  }

  private syncAssignees(): void {
    this.form.patchValue({
      assignees: this.selectedMembers.map((m) => ({ userId: m.id })), // Format selected assignees into API payload structure
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
      ? this.taskService.updateTask(payload) // Update existing task
      : this.taskService.createTask(this.form.value); // Create new task

    request.subscribe({
      next: (res) => {
        this.displayToast(this.form.value.name, this.editId ? 'updated' : 'created'); // Show success notification
        this.resetForm(); // Clear the form
        (document.getElementById('add_task') as HTMLDialogElement)?.close(); // Automatically close the modal
        this.isSubmitting = false; // Reset submission loading state
      },
      error: (err) => {
        console.error('Error saving task:', err); // Log error if submission fails
        this.showError(err.error?.message || 'An unexpected error occurred while saving the task.'); // Display error message
        this.isSubmitting = false; // Reset submission loading state
      },
    });
  }

  private displayToast(name: string, action: string) {
    // Display a success notification
    this.toastMessage = `"${name}" was ${action} successfully!`;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hides the toast after 3 seconds
  }

  showError(message: string) {
    // Display an error message
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 5000); // Auto-hide after 5 seconds
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
