import { Component } from '@angular/core';

@Component({
  selector: 'app-task-activity',
  standalone: false,
  templateUrl: './task-activity.html',
  styleUrl: './task-activity.css',
})
export class TaskActivity {
  taskActivity = [
    { task: 'Design Homepage', user: 'Alice', time: '2 hours ago', status: 'Completed' },
    { task: 'Implement Login', user: 'Bob', time: '30 minutes ago', status: 'In Progress' },
    { task: 'Write Unit Tests', user: 'Charlie', time: '1 hour ago', status: 'At Risk' },
    { task: 'Deploy to Staging', user: 'Diana', time: '3 hours ago', status: 'Delayed' },
    { task: 'Implement Login', user: 'Bob', time: '30 minutes ago', status: 'In Progress' }
  ];
}
