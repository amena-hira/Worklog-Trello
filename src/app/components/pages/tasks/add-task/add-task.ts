import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  assignees: Assignee[] = [
    { id: 1, name: 'Alice', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 4, name: 'David', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filteredAssignees = this.assignees;

    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      project: [''],
      assignees: [[] as number[]],
      dueDate: [''],
      priority: [''],
    });
  }

  private syncAssignees(): void {
    this.taskForm.patchValue({
      assignees: this.selectedMembers.map((m) => m.id),
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      console.log('Task Data:', this.taskForm.value);
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
