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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        const today = new Date();
        const currentUserEmail = sessionStorage.getItem('email');
        
        const relevantTasks = tasks.filter((task: TaskModel) => {
          if (!currentUserEmail) return true; // Fallback if no user is logged in
          const isCreator = task.createdByUserEmail === currentUserEmail;
          const isAssignee = (task.assignees || []).some((a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail);
          return isCreator || isAssignee;
        });

        const mappedTasks = relevantTasks.map((task: TaskModel, index: number) => {
          const mappedAssignees = (task.assignees || []).map((a: any, i: number) => ({
            name: a.userName || a.name,
            avatarUrl: `https://i.pravatar.cc/150?u=${a.userName || i}`
          }));

          return {
            ...task,
            assigneeAvatar: {
              images: mappedAssignees.map(a => a.avatarUrl),
              assignees: mappedAssignees
            },
            bgColor: ['bg-red-100', 'bg-sky-100', 'bg-emerald-100', 'bg-rose-100'][index % 4],
            textColor: ['text-red-700', 'text-sky-700', 'text-emerald-700', 'text-rose-700'][index % 4],
            priority: task.priority || 'Low',
            project: task.projectName || 'General'
          };
        });

        this.todayTasks = mappedTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString());
        this.otherTasks = mappedTasks.filter(task => !task.dueDate || new Date(task.dueDate).toDateString() !== today.toDateString());
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }
}
