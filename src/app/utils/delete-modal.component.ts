import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info' | 'question' | 'success';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog" [ngClass]="data.type">
      <div class="dialog-header">
        <div class="dialog-icon-container" [ngClass]="data.type + '-icon'">
          <mat-icon>{{getIcon()}}</mat-icon>
        </div>
        <h2 class="dialog-title">{{data.title}}</h2>
      </div>

      <div class="dialog-content">
        <p>{{data.message}}</p>
      </div>

      <div class="dialog-actions">
        <button mat-button class="cancel-button" (click)="onCancel()">
          {{data.cancelText || 'Cancelar'}}
        </button>
        <button mat-raised-button
                [ngClass]="'confirm-button-' + data.type"
                (click)="onConfirm()">
          {{data.confirmText || 'Confirmar'}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 0;
      border-radius: 10px;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      padding: 24px 24px 16px;
      position: relative;
    }

    .dialog-header::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 24px;
      width: 60px;
      height: 4px;
      border-radius: 2px;
    }

    .dialog-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }

    .dialog-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
    }

    .dialog-icon-container mat-icon {
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .warning-icon {
      background-color: rgba(237, 137, 54, 0.1);
      color: #ed8936;
    }

    .warning-icon + .dialog-title {
      color: #c05621;
    }

    .error-icon {
      background-color: rgba(229, 62, 62, 0.1);
      color: #e53e3e;
    }

    .error-icon + .dialog-title {
      color: #c53030;
    }

    .info-icon {
      background-color: rgba(66, 153, 225, 0.1);
      color: #4299e1;
    }

    .info-icon + .dialog-title {
      color: #2b6cb0;
    }

    .question-icon {
      background-color: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .question-icon + .dialog-title {
      color: #4c51bf;
    }

    .success-icon {
      background-color: rgba(10, 124, 67, 0.1);
      color: #0a7c43;
    }

    .success-icon + .dialog-title {
      color: #2f855a;
    }

    .dialog-content {
      padding: 16px 24px;
      font-size: 1.05rem;
      color: #4a5568;
      min-width: 350px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px 24px 24px;
      gap: 12px;
    }

    .cancel-button {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-weight: 500;
    }

    .confirm-button-warning,
    .confirm-button-error,
    .confirm-button-info,
    .confirm-button-question,
    .confirm-button-success {
      border-radius: 8px;
      font-weight: 500;
      padding: 8px 20px;
      color: white;
    }

    .confirm-button-warning {
      background-color: #ed8936;
    }

    .confirm-button-error {
      background-color: #e53e3e;
    }

    .confirm-button-info {
      background: linear-gradient(135deg, #4299e1, #2b6cb0);
    }

    .confirm-button-question {
      background: linear-gradient(135deg, #667eea, #4c51bf);
    }

    .confirm-button-success {
      background: linear-gradient(135deg, #0a7c43, #2f855a);
    }

    /* Gradient line styles based on dialog type */
    .warning .dialog-header::after {
      background: linear-gradient(135deg, #ed8936, #c05621);
    }

    .error .dialog-header::after {
      background: linear-gradient(135deg, #e53e3e, #c53030);
    }

    .info .dialog-header::after {
      background: linear-gradient(135deg, #4299e1, #2b6cb0);
    }

    .question .dialog-header::after {
      background: linear-gradient(135deg, #667eea, #4c51bf);
    }

    .success .dialog-header::after {
      background: linear-gradient(135deg, #0a7c43, #2f855a);
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    // Asegurarse de que siempre haya un tipo
    this.data.type = this.data.type || 'question';
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'question':
      default: return 'help';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
