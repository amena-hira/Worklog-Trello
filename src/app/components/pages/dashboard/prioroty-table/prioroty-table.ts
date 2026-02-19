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
      dueDate: '2026-02-27',
      priority: 'High',
      status: 'In Progress',
      statusColor: 'badge-success',
    },
    {
      name: 'Implement Login',
      dueDate: '2026-02-05',
      priority: 'Medium',
      status: 'Pending',
      statusColor: 'badge-warning',
    },
    {
      name: 'Write Unit Tests',
      dueDate: '2026-03-10',
      priority: 'Low',
      status: 'Overdue',
      statusColor: 'badge-error',
    },
    {
      name: 'Deploy to Staging',
      dueDate: '2026-03-15',
      priority: 'High',
      status: 'Pending',
      statusColor: 'badge-warning',
    },
  ];
}
