import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cards = [
    { title: 'Completed Tasks', total: '123', icon: 'fa-solid fa-chart-line', color: 'text-blue-400'},
    { title: 'Incompleted Tasks', total: '21', icon: 'fa-solid fa-chart-line', color: 'text-rose-700'},
    { title: 'Overdue Tasks', total: '04', icon: 'fa-solid fa-chart-line', color: 'text-amber-500'},
    { title: 'Total Tasks', total: '148', icon: 'fa-solid fa-chart-line', color: 'text-teal-500'},
  ];

  priority_Tasks = [
    { name: 'Design Homepage', dueDate: '2024-07-30', priority: 'High', status: 'In Progress', statusColor: 'success' },
    { name: 'Implement Login', dueDate: '2024-08-05', priority: 'Medium', status: 'Pending', statusColor: 'warning' },
    { name: 'Write Unit Tests', dueDate: '2024-08-10', priority: 'Low', status: 'Overdue', statusColor: 'error' },
    { name: 'Deploy to Staging', dueDate: '2024-08-15', priority: 'High', status: 'Pending', statusColor: 'warning' },
    { name: 'Update User Profile', dueDate: '2024-08-20', priority: 'Medium', status: 'In Progress', statusColor: 'success' },
    { name: 'Fix Bug #123', dueDate: '2024-08-25', priority: 'High', status: 'Overdue', statusColor: 'error' },
  ];

  projectStatus = [
    { icon: 'fa-regular fa-circle-check', name: 'Project Delta', phase: 'Development', progress: 80, status: 'On Track', dueDate: 'Oct 20', background: 'bg-green-100', textColor: 'text-green-600' },
    { icon: 'fa-solid fa-triangle-exclamation', name: 'Project Beta', phase: 'Testing', progress: 45, status: 'At Risk', dueDate: 'Aug 15', background: 'bg-amber-100', textColor: 'text-amber-600' },
    { icon: 'fa-regular fa-circle-xmark', name: 'Project Gamma', phase: 'Planning', progress: 20, status: 'Delayed', dueDate: 'Sep 23', background: 'bg-red-100', textColor: 'text-red-600' },
    { icon: 'fa-regular fa-circle-check', name: 'Project Alpha', phase: 'Development', progress: 60, status: 'Completed', dueDate: 'Jul 26', background: 'bg-blue-100', textColor: 'text-blue-600' },
  ];

  taskActivity = [
    { task: 'Design Homepage', user: 'Alice', time: '2 hours ago', status: 'Completed' },
    { task: 'Implement Login', user: 'Bob', time: '30 minutes ago', status: 'In Progress' },
    { task: 'Write Unit Tests', user: 'Charlie', time: '1 hour ago', status: 'At Risk' },
    { task: 'Deploy to Staging', user: 'Diana', time: '3 hours ago', status: 'Delayed' },
  ];
}
