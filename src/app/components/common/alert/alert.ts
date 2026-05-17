import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  private _errorMessage: string = 'Unable!';

  @Input() set errorMessage(value: string | undefined | null) {
    this._errorMessage = value || 'Unable!';
  }

  get errorMessage(): string {
    return this._errorMessage;
  }
}
