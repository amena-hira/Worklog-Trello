import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../service/users/users.service';
import { TaskService } from '../../../service/tasks/task.service';
import { ProjectService } from '../../../service/projects/project.service';

type Assignee = { id: number; name: string; avatar: string }; 

@Component({
  selector: 'app-form-project-task',
  standalone: false,
  templateUrl: './form-project-task.html',
  styleUrl: './form-project-task.css',
})
export class FormProjectTask implements OnInit, OnChanges {
  @Input() editData: any = null;
  editId: number | null = null;
  taskForm!: FormGroup;
  selectedMembers: Assignee[] = [];
  searchTerm = '';
  filteredAssignees: Assignee[] = [];
  form!: FormGroup;

  title = '';
  currentUserEmail = '';

  showToast = false;
  toastMessage = '';

  assignees: Assignee[] = [];
  projects: any[] = [];

  projectColors = [ 'sky', 'violet', 'fuchsia', 'green',  'teal', 'yellow', 'orange', 'rose' ];

  constructor(
    private fb: FormBuilder, 
    private router:Router, 
    private usersService: UsersService,
    private taskService: TaskService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const currentUserEmail = sessionStorage.getItem('email');
    const url = this.router.url;
    if (url.includes('project')) {
      this.title = 'Project';
      this.buildProjectForm(currentUserEmail || '');
    } else {
      this.title = 'Task';
      this.buildTaskForm(currentUserEmail || '');
    }
    this.fetchAssignees();
    this.fetchProjects();

    if (this.editData) {
      this.populateForm(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && !changes['editData'].isFirstChange()) {
      if (this.editData) {
        this.populateForm(this.editData);
      } else {
        this.resetForm();
      }
    }
  }

  fetchAssignees(): void {
    if (this.title === 'Project') {
      this.usersService.getUsers().subscribe({
        next: (users: any[]) => {
          this.assignees = users
            .filter(user => user.role === 'ROLE_USER')
            .map((user, index) => ({
              id: user.id || index + 1, // Fallback to ensure the ID is always unique
              name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              avatar: `https://i.pravatar.cc/150?u=${user.id || index}`
            }));
          this.filteredAssignees = this.assignees;
        },
        error: (err) => console.error('Error fetching users:', err)
      });
    }
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        const currentUserEmail = sessionStorage.getItem('email');
        
        this.projects = projects.filter(project => {
          if (!currentUserEmail) return true;
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some((m: any) => m.userEmail === currentUserEmail);
          return isCreator || isMember;
        });

        // If editing an existing task, pre-fill assignees immediately after projects load
        if (this.title === 'Task' && this.form.get('projectId')?.value) {
          this.updateAssigneesForProject(this.form.get('projectId')?.value);
        }
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  buildProjectForm(currentUserEmail: string){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      dueDate: [''],
      createdByUserEmail: [currentUserEmail],
      members: [[]],
      color: [''],
    });
  }

  buildTaskForm(currentUserEmail: string){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      priority: [''],
      isCompleted: [false],
      dueDate: [''],
      projectId: [''],
      createdByUserEmail: [currentUserEmail],
      assignees: [[]],
    });

    // Reactively update assignees dropdown whenever the selected project changes
    this.form.get('projectId')?.valueChanges.subscribe(projectId => {
      this.updateAssigneesForProject(projectId);
    });
  }

  private updateAssigneesForProject(projectId: any): void {
    const selectedProject = this.projects.find(p => p.id == projectId);
    if (selectedProject && selectedProject.members) {
      this.assignees = selectedProject.members.map((m: any, index: number) => ({
        id: m.userId || m.id || index + 1,
        name: m.userName || m.name,
        avatar: `https://i.pravatar.cc/150?u=${m.userId || m.id || index}`
      }));
    } else {
      this.assignees = [];
    }
    this.filteredAssignees = this.assignees;

    // Clean up selected members if they don't belong to the newly selected project
    this.selectedMembers = this.selectedMembers.filter(sm => 
      this.assignees.some(a => a.id === sm.id)
    );
    this.syncAssignees();
  }

  private syncAssignees(): void {
    if (this.title === 'Project') {
      this.form.patchValue({
        members: this.selectedMembers.map((m) => ({ userId: m.id, role: 'MEMBER' })),
      });
    } else {
      this.form.patchValue({
        assignees: this.selectedMembers.map((m) => ({ userId: m.id })),
      });
    }
  }

  populateForm(data: any): void {
    this.editId = data.id;
    const formattedDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '';
    
    if (this.title === 'Project') {
      this.form.patchValue({
        name: data.name,
        description: data.description,
        dueDate: formattedDate,
        color: data.color || '',
      });
      if (data.members) {
        this.selectedMembers = data.members.map((m: any) => ({
          id: m.userId || m.id,
          name: m.userName || m.name,
          avatar: `https://i.pravatar.cc/150?u=${m.userId || m.id}`
        }));
        this.syncAssignees();
      }
    } else {
      this.form.patchValue({
        name: data.name,
        description: data.description,
        priority: data.priority,
        isCompleted: data.isCompleted,
        dueDate: formattedDate,
        projectId: data.projectId || '',
      });
      if (data.assignees) {
        this.selectedMembers = data.assignees.map((a: any) => ({
          id: a.userId || a.id,
          name: a.userName || a.name,
          avatar: a.avatarUrl || `https://i.pravatar.cc/150?u=${a.userId || a.id}`
        }));
        this.syncAssignees();
      }
    }
  }

  resetForm(): void {
    this.editId = null;
    this.selectedMembers = [];
    const email = sessionStorage.getItem('email') || '';
    if (this.title === 'Project') {
      this.buildProjectForm(email);
    } else {
      this.buildTaskForm(email);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Data:', this.form.value);
      const payload = { ...this.form.value, id: this.editId };

      if (this.title === 'Project') {
        const request = this.editId 
          ? this.projectService.updateProject(payload)
          : this.projectService.createProject(this.form.value);

        request.subscribe({
          next: (res) => {
            console.log(`Project ${this.editId ? 'updated' : 'created'} successfully`, res);
            this.displayToast(this.form.value.name, this.editId ? 'updated' : 'created');
            this.resetForm();
            (document.getElementById('add_task') as HTMLDialogElement)?.close();
          },
          error: (err) => console.error('Error creating task:', err)
        });
      } else {
        const request = this.editId 
          ? this.taskService.updateTask(payload)
          : this.taskService.createTask(this.form.value);

        request.subscribe({
          next: (res) => {
            console.log(`Task ${this.editId ? 'updated' : 'created'} successfully`, res);
            this.displayToast(this.form.value.name, this.editId ? 'updated' : 'created');
            this.resetForm();
            (document.getElementById('add_task') as HTMLDialogElement)?.close();
          },
          error: (err) => console.error('Error creating task:', err)
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  private displayToast(name: string, action: string) {
    this.toastMessage = `"${name}" was ${action} successfully ${this.title}!`;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hides the toast after 3 seconds
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;

    this.filteredAssignees = this.assignees.filter((member) =>
      member.name.toLowerCase().includes(value.toLowerCase()),
    );
  }

  onSelectMember(member: Assignee): void {
    const exists = this.selectedMembers.some((m) => m.id === member.id);

    this.selectedMembers = exists
      ? this.selectedMembers.filter((m) => m.id !== member.id)
      : [...this.selectedMembers, member];

    this.syncAssignees();
  }

  isSelected(member: Assignee): boolean {
    return this.selectedMembers.some((m) => m.id === member.id);
  }

  onRemoveSelectMember(member: Assignee): void {
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
    this.syncAssignees();
  }
}
