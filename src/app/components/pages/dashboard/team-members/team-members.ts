import { Component } from '@angular/core';

@Component({
  selector: 'app-team-members',
  standalone: false,
  templateUrl: './team-members.html',
  styleUrl: './team-members.css',
})
export class TeamMembers {

  members = [
    { image: 'https://i.pravatar.cc/80?img=1', name: 'Alice Smith', role: 'Project Manager', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=12', name: 'Mike Johnson', role: 'UUDX Designer', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=5', name: 'Emily Davis', role: 'Frontend Developer', isActive: false},
    { image: 'https://i.pravatar.cc/80?img=8', name: 'Chris Brown', role: 'Backend Developer', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=16', name: 'Sophia Lee', role: 'QA Engineer', isActive: true}
  ]
}
