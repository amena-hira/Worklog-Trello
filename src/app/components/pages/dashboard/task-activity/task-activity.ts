import { Component } from '@angular/core';

@Component({
  selector: 'app-task-activity',
  standalone: false,
  templateUrl: './task-activity.html',
  styleUrl: './task-activity.css',
})
export class TaskActivity {
  activities = [
    { image: 'https://i.pravatar.cc/80?img=1', name: 'Alice Smith', task: 'Design Homepage', time: '2 hours', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=12', name: 'Mike Johnson', task: 'Implement Login', time: '30 minutes', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=5', name: 'Emily Davis', task: 'Write Unit Tests', time: '1 hour', isActive: false},
    { image: 'https://i.pravatar.cc/80?img=5', name: 'Emily Davis', task: 'Deploy to Staging', time: '3 hours', isActive: false},
    { image: 'https://i.pravatar.cc/80?img=8', name: 'Chris Brown', task: 'Implement Login', time: '30 minutes', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=8', name: 'Chris Brown', task: 'Write Unit Tests', time: '1 hour', isActive: true},
    { image: 'https://i.pravatar.cc/80?img=16', name: 'Sophia Lee', task: 'Deploy to Staging', time: '3 hours', isActive: true},
  ]
}
