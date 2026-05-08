import { Component, OnInit } from '@angular/core';
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
export class FormProjectTask implements OnInit {
  taskForm!: FormGroup;
  selectedMembers: Assignee[] = [];
  searchTerm = '';
  filteredAssignees: Assignee[] = [];
  form!: FormGroup;

  title = '';
  currentUserEmail = '';

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
  }

  fetchAssignees(): void {
    this.usersService.getUsers().subscribe({
      next: (users: any[]) => {
        this.assignees = users
          .filter(user => user.role === 'ROLE_USER')
          .map((user, index) => ({
            id: user.id || index + 1, // Fallback to ensure the ID is always unique
            name: user.last_name || `${user.first_name}`,
            avatar: `https://i.pravatar.cc/150?u=${user.id || index}`
          }));
        this.filteredAssignees = this.assignees;
      },
      error: (err) => console.error('Error fetching users:', err)
    });
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

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Data:', this.form.value);
      const email = sessionStorage.getItem('email') || '';

      if (this.title === 'Project') {
        this.projectService.createProject(this.form.value).subscribe({
          next: (res) => {
            console.log('Project created successfully', res);
            // Clear the form and reset the creator email
            this.selectedMembers = [];
            this.buildProjectForm(email);
          },
          error: (err) => console.error('Error creating project:', err)
        });
      } else {
        this.taskService.createTask(this.form.value).subscribe({
          next: (res) => {
            console.log('Task created successfully', res);
            // Clear the form and reset the creator email
            this.selectedMembers = [];
            this.buildTaskForm(email);
          },
          error: (err) => console.error('Error creating task:', err)
        });
      }
    } else {
      console.log('Form is invalid');
    }
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
