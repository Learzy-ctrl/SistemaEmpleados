import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-{{type}} alert-dismissible fade show" role="alert">
      {{message}}
      <button type="button" class="btn-close" (click)="dismiss()"></button>
    </div>
  `,
  styles: []
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';

  dismiss(): void {
    this.message = '';
  }
}