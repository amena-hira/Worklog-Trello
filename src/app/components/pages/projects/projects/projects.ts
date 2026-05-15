import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';
import { Project } from '../../../../model/project';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        const currentUserEmail = sessionStorage.getItem('email');
        
        let filteredProjects = projects.filter((project: Project) => {
          if (project.completed) return false; // Excludes completed projects

          if (!currentUserEmail) return true; // Fallback if no user is logged in
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some(m => m.userEmail === currentUserEmail);
          return isCreator || isMember;
        });

        // Sort descending by created date (newest first)
        filteredProjects.sort((a, b) => {
          const dateA = a.created ? new Date(a.created).getTime() : (a.id || 0);
          const dateB = b.created ? new Date(b.created).getTime() : (b.id || 0);
          return dateB - dateA;
        });

        // Take only the recent 6 projects
        const recentProjects = filteredProjects.slice(0, 6);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.projects = recentProjects.map(project => {
          let dueDays = 0;
          if (project.dueDate) {
            const dueDate = new Date(project.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - today.getTime();
            dueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return {
            ...project,
            progress: project.progress || 0,
            totalDue: project.tasksDue || 0,
            dueDays: dueDays,
            textColor: project.color ? `text-${project.color}-600` : 'text-sky-600',
            assignees: (project.members || []).map((m: any, i: number) => `https://i.pravatar.cc/150?u=${m.userId || i}`)
          };
        });
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }
}
