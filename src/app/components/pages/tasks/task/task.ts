import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input() title: string = 'Tasks';
  @Input() allTasks: any[] = [];
  @Output() onTaskEdit = new EventEmitter<any>();
  @Output() onTaskDelete = new EventEmitter<any>();

  openTask: any = null;
  selectedTask: any = null;

  constructor(private taskService: TaskService, private el: ElementRef) {}

  openTaskDetails(task: any): void {
    this.selectedTask = task;
    const modal = this.el.nativeElement.querySelector('#task_details') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  editTask(task: any) {
    const currentStatus = task.isCompleted ?? !!task.completed;

    this.taskService
      .updateTaskStats(task.id, {
        isCompleted: !currentStatus,
      })
      .subscribe({
        next: (updatedTask: any) => {
          task.isCompleted = updatedTask.isCompleted ?? !!updatedTask.completed;
          task.completed = updatedTask.completed;
          task.modified = updatedTask.modified;

          console.log('Task status updated:', updatedTask);
        },
        error: (err) => {
          console.error('Error updating task status:', err);
        },
      });
  }
}
