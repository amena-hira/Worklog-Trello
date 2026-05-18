import { Component, ElementRef } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';
import { Task } from '../../../../model/task';

@Component({
  selector: 'app-todays-tasks',
  standalone: false,
  templateUrl: './todays-tasks.html',
  styleUrl: './todays-tasks.css',
})
export class TodaysTasks {
  today_tasks: Task[] = [];
  selectedTaskForEdit: any = null;
  // 1. Add this property to hold the data for the clicked task
  selectedTask: any = null; 

  constructor(private taskService: TaskService, private el: ElementRef) {}

  ngOnInit(): void {
    this.fetchTodaysTasks();
  }

  // 2. Add this method to handle the click event
  openTaskDetails(task: any): void {
    // Set the selected task so it gets passed to <app-task-details [task]="selectedTask">
    this.selectedTask = task;
    
    // Open the DaisyUI modal scoped to this specific component instance
    const modal = this.el.nativeElement.querySelector('#task_details') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  fetchTodaysTasks() {
    this.taskService.getAllTasks().subscribe((tasks) => {
      const today = new Date();
      const currentUserEmail = sessionStorage.getItem('email');

      this.today_tasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const isToday = dueDate.toDateString() === today.toDateString();

        if (!currentUserEmail) return isToday;

        const isAssignee = (task.assignees || []).some(
          (a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail,
        );
        const isCreator = task.createdByUserEmail === currentUserEmail;

        return isToday && (isAssignee || isCreator);
      });
    });
  }

  openCreateModal() {
    this.selectedTaskForEdit = null;
    this.showModal('add_task');
  }

  private showModal(modalId: string) {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.showModal();
  }
}
