import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';

@Component({
  selector: 'app-project-status',
  standalone: false,
  templateUrl: './project-status.html',
  styleUrl: './project-status.css',
})
export class ProjectStatus implements OnInit{
  projectStatus = [
    {
      name: 'Project Alpha',
      progress: 60,
      totalDue: 3,
      textColor: 'text-sky-600',
    },
    {
      name: 'Project Delta',
      progress: 80,
      totalDue: 5,
      textColor: 'text-rose-500',
    },
    {
      name: 'Project Beta',
      progress: 45,
      totalDue: 2,
      textColor: 'text-green-600',
    },
    {
      name: 'Project Gamma',
      progress: 20,
      totalDue: 8,
      textColor: 'text-emerald-500',
    },

  ];

  allProjectStatus: any[] = [];

  constructor(
    private projectService: ProjectService
  ) {
    this.allProjectStatus = this.projectStatus;
  }

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(){
    this.projectService.getRecentProjects().subscribe({
      next: (recentProjects) => {
        const currentUserEmail = sessionStorage.getItem('email');
        
        const relevantProjects = recentProjects.filter(project => {
          if (!currentUserEmail) return true; // Fallback if no user is logged in
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some(m => m.userEmail === currentUserEmail);
          return isCreator || isMember;
        });

        this.allProjectStatus = relevantProjects.map(project => {
          const progress = project.progress || 0;
          const totalDue = project.tasksDue || 0;
          console.log(project.name,project.color);

          return {
            name: project.name,
            progress: progress,
            totalDue: totalDue,
            color: project.color,
          };
        });

        console.log("All Projects: ", this.allProjectStatus);
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

}
