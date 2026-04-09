import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type Assignee = { id: number; name: string; avatar: string };

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnInit {
  taskForm!: FormGroup;
  selectedMembers: Assignee[] = [];
  searchTerm = '';
  filteredAssignees: Assignee[] = [];
  form!: FormGroup;

  assignees: Assignee[] = [
    { id: 1, name: 'Alice', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 4, name: 'David', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  ];

  projectColors = [ 'border-sky-600 bg-sky-600', 'border-violet-500 bg-violet-500', 'border-fuchsia-600 bg-fuchsia-600', 'border-green-600 bg-green-600',  'border-teal-500 bg-teal-600', 'border-yellow-500 bg-yellow-500', 'border-orange-500 bg-orange-500', 'border-rose-600 bg-rose-600' ];

  constructor(private fb: FormBuilder, private router:Router) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('project')) {
        this.buildProjectForm();
    } else {
        this.buildTaskForm();
    }
    this.filteredAssignees = this.assignees;
  }

  buildProjectForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      dueDate: [''],
      assignees: [[] as number[]],
      color: [''],
    });
  }

  buildTaskForm(){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      project: [''],
      assignees: [[] as number[]],
      dueDate: [''],
      priority: [''],
    });
  }

  private syncAssignees(): void {
    this.form.patchValue({
      assignees: this.selectedMembers.map((m) => m.id),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Data:', this.form.value);
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
