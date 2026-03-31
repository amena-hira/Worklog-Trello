import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  priority_Tasks = [
    {
      name: 'Design Homepage',
      project: 'Website',
      priority: 'High',
      dueDate: '10:30 AM',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      assigneeAvatar: {
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
      },
    },
    {
      name: 'Implement Login',
      project: 'CLient',
      priority: 'Medium',
      dueDate: '12:00 PM',
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-700',
      assigneeAvatar: {
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
      },
    },
    {
      name: 'Write Unit Tests',
      project: 'Personal',
      priority: 'Low',
      dueDate: '4:30 PM',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      assigneeAvatar: {
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
      },
    },
    {
      name: 'Deploy to Staging',
      project: 'Marketing',
      priority: 'High',
      dueDate: '2:59 PM',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-700',
      assigneeAvatar: {
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
      },
    },
  ];

}
