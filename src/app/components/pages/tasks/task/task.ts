import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input() title: string = 'Tasks';
  @Input() priority_Tasks: any[] = [];
}
