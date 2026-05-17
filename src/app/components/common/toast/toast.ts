import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  private _errorMessage: string = 'Unable!';

  @Input() set errorMessage(value: string | undefined | null) {
    this._errorMessage = value || 'Unable!';
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  @Input() successMessage: string | null | undefined = null;
}
