import { Component } from '@angular/core';

@Component({
  selector: 'app-prioroty-table',
  standalone: false,
  templateUrl: './prioroty-table.html',
  styleUrl: './prioroty-table.css',
})
export class PriorotyTable {
  priority_Tasks = [
    {
      name: 'Design Homepage',
      project: 'Website',
      priority: 'High',
      dueDate: '10:30 AM',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    {
      name: 'Implement Login',
      project: 'CLient',
      priority: 'Medium',
      dueDate: '12:00 PM',
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-700',
    },
    {
      name: 'Write Unit Tests',
      project: 'Personal',
      priority: 'Low',
      dueDate: '4:30 PM',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
    },
    {
      name: 'Deploy to Staging',
      project: 'Marketing',
      priority: 'High',
      dueDate: '2:59 PM',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-700',
    },
    {
      name: 'Implement Login',
      project: 'CLient',
      priority: 'Medium',
      dueDate: '12:00 PM',
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-700',
    },
    {
      name: 'Write Unit Tests',
      project: 'Personal',
      priority: 'Low',
      dueDate: '4:30 PM',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
    },
  ];
}
