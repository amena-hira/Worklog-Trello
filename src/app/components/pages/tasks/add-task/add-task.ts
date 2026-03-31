import { Component, OnInit } from '@angular/core';
import "cally";

type Assignee = { id: number; name: string; avatar: string };

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnInit{

  assignees: Assignee[] = [
    { id: 1, name: 'Alice', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 4, name: 'David', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  ];
  selectedMembers: Assignee[] = [];
  searchTerm: string = '';
  filteredAssignees: Assignee[] = [];

  ngOnInit() {
    this.filteredAssignees = this.assignees;
  }

  onSearch() {
    this.filteredAssignees = this.assignees.filter((member) =>
      member.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSelectMember(member: Assignee) {
    const exists = this.selectedMembers.some((m) => m.id === member.id);

    this.selectedMembers = exists
      ? this.selectedMembers.filter((m) => m.id !== member.id)
      : [...this.selectedMembers, member];
  }
  isSelected(member: Assignee): boolean {
    return this.selectedMembers.some((m) => m.id === member.id);
  }

  onRemoveSelectMember(member: Assignee) {
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
  }
}
