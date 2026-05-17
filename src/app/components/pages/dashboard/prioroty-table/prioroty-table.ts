import { Component, OnInit } from '@angular/core';
import { Task } from '../../../../model/task';
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-prioroty-table',
  standalone: false,
  templateUrl: './prioroty-table.html',
  styleUrl: './prioroty-table.css',
})
export class PriorotyTable implements OnInit {
  

  today_tasks: Task[] = [];
  selectedTaskForEdit: any = null;

  constructor(private taskService:TaskService) { }

  ngOnInit(): void {
    this.fetchTodaysTasks()
  }

  fetchTodaysTasks() {
    console.log('Fetching today\'s tasks...');
    this.taskService.getAllTasks().subscribe(tasks => {
      console.log('All tasks fetched:', tasks);
      const today = new Date();
      const currentUserEmail = sessionStorage.getItem('email');
      
      this.today_tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const isToday = dueDate.toDateString() === today.toDateString();
        
        if (!currentUserEmail) return isToday;
        
        const isAssignee = (task.assignees || []).some((a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail);
        const isCreator = task.createdByUserEmail === currentUserEmail;
        
        return isToday && (isAssignee || isCreator);
      });
      console.log("Todays Task: ",this.today_tasks);
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
