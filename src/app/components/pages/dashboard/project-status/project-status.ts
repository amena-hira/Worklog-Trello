import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';

@Component({
  selector: 'app-project-status',
  standalone: false,
  templateUrl: './project-status.html',
  styleUrl: './project-status.css',
})
export class ProjectStatus implements OnInit {
  allProjectStatus: any[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.errorMessage = null;
    this.projectService.getRecentProjects().subscribe({
      next: (recentProjects) => {
        const currentUserEmail = sessionStorage.getItem('email');

        const relevantProjects = recentProjects.filter((project) => {
          if (!currentUserEmail) return true; // Fallback if no user is logged in
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some((m) => m.userEmail === currentUserEmail);
          return isCreator || isMember;
        });

        this.allProjectStatus = relevantProjects.map((project) => {
          const progress = project.progress || 0;
          const totalDue = project.tasksDue || 0;
          console.log(project.name, project.color);

          return {
            name: project.name,
            progress: progress,
            totalDue: totalDue,
            color: project.color,
          };
        });

        console.log('All Projects: ', this.allProjectStatus);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch project status.';
        this.loading = false;
      },
    });
  }
}
