import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';

@Component({
  selector: 'app-overdue-projects-list',
  standalone: false,
  templateUrl: './overdue-projects-list.html',
  styleUrl: './overdue-projects-list.css',
})
export class OverdueProjectsList implements OnInit {
  projects: any[] = [];

  @Output() onProjectEdit = new EventEmitter<any>();
  @Output() onProjectDelete = new EventEmitter<any>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        console.log(projects);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentUserEmail = sessionStorage.getItem('email');
        const role = sessionStorage.getItem('authRole');
        const isAdmin = role === 'ROLE_ADMIN';

        // Sort them by due date in descending order
        const sortedProjects = [...projects].sort((a: any, b: any) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });

        this.projects = sortedProjects.map((project: any) => {
          let isOverdue = false;
          if (project.dueDate) {
            const dueDate = new Date(project.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            isOverdue = dueDate.getTime() < today.getTime();
          }
          
          const isCompleted = !!project.completed;
          const showError = isOverdue && !isCompleted;

          return {
            ...project,
            name: project.name,
            project: 'Project',
            totalTasks: project.totalTasks,
            dueDate: project.dueDate || 'No due date',
            bgColor: showError ? 'bg-error/20' : (project.color ? `bg-${project.color}-100` : 'bg-gray-100'),
            textColor: showError ? 'text-red-800' : (project.color ? `text-${project.color}-700` : 'text-gray-700'),
            borderColor: showError ? 'border-red-500' : (project.color ? `border-${project.color}-500` : 'border-gray-500'),
            createdByUserEmail: project.createdByUserEmail,
            completed: isCompleted,
            isOverdue: isOverdue,
            canEdit: isAdmin || project.createdByUserEmail === currentUserEmail
          };
        });
      },
      error: (err) => console.error('Error fetching overdue projects:', err)
    });
  }
}
