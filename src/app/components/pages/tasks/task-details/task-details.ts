import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-details',
  standalone: false,
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails {
  private _task: any;

  @Input()
  set task(value: any) {
    this._task = value;
  }

  get task(): any {
    return this._task;
  }

}
