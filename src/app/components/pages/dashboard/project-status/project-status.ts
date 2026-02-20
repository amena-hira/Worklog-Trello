import { Component } from '@angular/core';

@Component({
  selector: 'app-project-status',
  standalone: false,
  templateUrl: './project-status.html',
  styleUrl: './project-status.css',
})
export class ProjectStatus {
  projectStatus = [
    {
      icon: 'fa-regular fa-circle-check',
      name: 'Project Alpha',
      progress: 60,
      totalDue: 3,
      textColor: 'text-sky-600',
    },
    {
      icon: 'fa-regular fa-circle-check',
      name: 'Project Delta',
      progress: 80,
      totalDue: 5,
      textColor: 'text-violet-500',
    },
    {
      icon: 'fa-solid fa-triangle-exclamation',
      name: 'Project Beta',
      progress: 45,
      totalDue: 2,
      textColor: 'text-green-600',
    },
    {
      icon: 'fa-regular fa-circle-xmark',
      name: 'Project Gamma',
      progress: 20,
      totalDue: 8,
      textColor: 'text-yellow-500',
    },
    
  ];
}
