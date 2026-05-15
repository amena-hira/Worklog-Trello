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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  private fetchTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        const currentUserEmail = sessionStorage.getItem('email');
        
        const relevantTasks = tasks.filter((task: TaskModel) => {
          if (!currentUserEmail) return true;
          const isCreator = task.createdByUserEmail === currentUserEmail;
          const isAssignee = (task.assignees || []).some((a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail);
          return isCreator || isAssignee;
        });

        const mappedTasks = this.mapTasksData(relevantTasks);
        this.distributeTasks(mappedTasks);
        this.calculateCounters(mappedTasks);
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  private mapTasksData(tasks: any[]): any[] {
    return tasks.map((task, index) => {
      const mappedAssignees = (task.assignees || []).map((a: any, i: number) => ({
        ...a,
        name: a.userName || a.name,
        avatarUrl: `https://i.pravatar.cc/150?u=${a.userName || i}`
      }));

      return {
        ...task,
        assigneeAvatar: {
          images: mappedAssignees.map((a: any) => a.avatarUrl),
          assignees: mappedAssignees
        },
        bgColor: ['bg-red-100', 'bg-sky-100', 'bg-emerald-100', 'bg-rose-100'][index % 4],
        textColor: ['text-red-700', 'text-sky-700', 'text-emerald-700', 'text-rose-700'][index % 4],
        priority: task.priority || 'Low',
        project: task.projectName || 'General'
      };
    });
  }

  private distributeTasks(tasks: any[]) {
    const todayStr = new Date().toDateString();
    this.todayTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === todayStr);
    this.otherTasks = tasks.filter(task => !task.dueDate || new Date(task.dueDate).toDateString() !== todayStr);
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

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.todayTasks = this.todayTasks.filter(t => t.id !== task.id);
        this.otherTasks = this.otherTasks.filter(t => t.id !== task.id);

        // Re-calculate counters dynamically to update headers seamlessly
        this.calculateCounters([...this.todayTasks, ...this.otherTasks]);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}
