import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  @Input() project: any;
}
