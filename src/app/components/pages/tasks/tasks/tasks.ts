import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';
import { Task as TaskModel } from '../../../../model/task';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  todayTasks: any[] = [];
  otherTasks: any[] = [];

  totalTaskCount = 0;
  todaysTaskCount = 0;
  tomorrowsTaskCount = 0;
  nextWeekTaskCount = 0;
  completedTaskCount = 0;
  selectedTaskForEdit: any = null;
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  private fetchTasks() {
    this.loading = true;
    this.errorMessage = null;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        // The backend now provides exactly the tasks for the logged-in user
        const mappedTasks = this.mapTasksData(tasks);
        this.distributeTasks(mappedTasks);
        this.calculateCounters(mappedTasks);
        this.loading = false;
        console.log('Fetched tasks:', mappedTasks);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.errorMessage = err?.error?.message || 'An unexpected error occurred while fetching tasks.';
        this.loading = false;
      }
    });
  }

  private mapTasksData(tasks: any[]): any[] {
    const currentUserEmail = sessionStorage.getItem('email');
    const role = sessionStorage.getItem('role');
    const isAdmin = role === 'admin' || role === 'ADMIN';

    return tasks.map((task, index) => {
      const mappedAssignees = (task.assignees || []).map((a: any, i: number) => ({
        ...a,
        name: a.userName || a.name,
        avatarUrl: `https://i.pravatar.cc/150?u=${a.userName || i}`
      }));

      return {
        ...task,
        isCompleted: task.isCompleted ?? !!task.completed,
        completed: task.completed,
        canEdit: isAdmin || task.createdByUserEmail === currentUserEmail,
        assigneeAvatar: {
          images: mappedAssignees.map((a: any) => a.avatarUrl),
          assignees: mappedAssignees
        },
        bgColor: ['bg-sky-100', 'bg-sky-100', 'bg-emerald-100', 'bg-blue-100'][index % 4],
        textColor: ['text-sky-700', 'text-sky-700', 'text-emerald-700', 'text-blue-700'][index % 4],
        priority: task.priority || 'Low',
        project: task.projectName || 'General'
      };
    });
  }

  private distributeTasks(tasks: any[]) {
    const todayStr = new Date().toDateString();
    this.todayTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === todayStr);
    this.otherTasks = tasks.filter(task => !task.dueDate || new Date(task.dueDate).toDateString() !== todayStr);

    this.otherTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    });
  }

  private calculateCounters(tasks: any[]) {
    this.totalTaskCount = tasks.length;
    this.completedTaskCount = 0;
    this.todaysTaskCount = 0;
    this.tomorrowsTaskCount = 0;
    this.nextWeekTaskCount = 0;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);

    const nextWeekDate = new Date(todayDate);
    nextWeekDate.setDate(todayDate.getDate() + 7);

    tasks.forEach(t => {
      if (t.isCompleted || !!t.completed) {
        this.completedTaskCount++;
      } else if (t.dueDate) {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        const taskTime = d.getTime();

        if (taskTime === todayDate.getTime()) {
          this.todaysTaskCount++;
        } else if (taskTime === tomorrowDate.getTime()) {
          this.tomorrowsTaskCount++;
        } else if (taskTime > tomorrowDate.getTime() && taskTime <= nextWeekDate.getTime()) {
          this.nextWeekTaskCount++;
        }
      }
    });
  }

  openCreateModal() {
    this.selectedTaskForEdit = null;
    this.showModal('add_task');
  }

  openEditModal(task: any) {
    this.selectedTaskForEdit = task;
    this.showModal('add_task');
  }

  private showModal(modalId: string) {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.showModal();
  }

  deleteTask(task: any) {
    if (!task || !task.id) return;
    this.successMessage = null;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.showSuccess('Delete successful! ');
        this.fetchTasks(); // refresh list automatically
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.showError(err?.error?.message || 'An unexpected error occurred while deleting the task.');
      }
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 5000); // Auto-hide after 5 seconds
  }

  showSuccess(message: string) {
        this.successMessage = message;
        setTimeout(() => this.successMessage = null, 5000); // Auto-hide after 5 seconds
      }
}
