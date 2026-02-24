import { Component } from '@angular/core';

@Component({
  selector: 'app-upcoming-deadline',
  standalone: false,
  templateUrl: './upcoming-deadline.html',
  styleUrl: './upcoming-deadline.css',
})
export class UpcomingDeadline {
  priority_Tasks = [
    {
      name: 'Design Homepage',
      dueDate: 'Tomorrow!',
      bgColor: 'bg-blue-700',
      dueColor: 'bg-red-700',
      textColor: 'text-red-800'
    },
    {
      name: 'Implement Login',
      dueDate: 'in 2 days',
      bgColor: 'bg-violet-700',
      dueColor: 'bg-yellow-600',
      textColor: 'text-yellow-800',
    },
    {
      name: 'Design Homepage',
      dueDate: 'Tomorrow!',
      bgColor: 'bg-blue-700',
      dueColor: 'bg-red-700',
      textColor: 'text-red-800'
    },
    {
      name: 'Implement Login',
      dueDate: 'in 2 days',
      bgColor: 'bg-violet-700',
      dueColor: 'bg-yellow-600',
      textColor: 'text-yellow-800',
    },
    {
      name: 'Design Homepage',
      dueDate: 'Tomorrow!',
      bgColor: 'bg-blue-700',
      dueColor: 'bg-red-700',
      textColor: 'text-red-800'
    },
    {
      name: 'Design Homepage',
      dueDate: 'Tomorrow!',
      bgColor: 'bg-blue-700',
      dueColor: 'bg-red-700',
      textColor: 'text-red-800'
    },

  ];
}
