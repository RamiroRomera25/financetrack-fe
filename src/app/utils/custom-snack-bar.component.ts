import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-custom-snack-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="custom-snack-bar">
      <mat-icon [style.color]="data.iconColor">{{ data.icon }}</mat-icon>
      <span class="message">{{ data.message }}</span>
      <button mat-button color="basic" (click)="snackBarRef.dismiss()">Cerrar</button>
    </div>
  `,
  styles: [`
    .custom-snack-bar {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .message {
      flex-grow: 1;
      padding: 8px 0;
    }
    mat-icon {
      margin-right: 8px;
      flex-shrink: 0;
    }
  `]
})
export class CustomSnackBarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<CustomSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
