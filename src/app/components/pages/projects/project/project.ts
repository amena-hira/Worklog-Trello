import { Component } from '@angular/core';

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  assigneeAvatar = {
    images: [
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg',
      'https://randomuser.me/api/portraits/women/1.jpg',
    ],
    members: [
      { name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
      { name: 'David', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    ],
  };
}
