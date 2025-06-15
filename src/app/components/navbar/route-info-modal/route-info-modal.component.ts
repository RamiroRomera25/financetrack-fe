import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"

@Component({
  selector: "app-route-info-modal",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="route-info-modal">
      <div class="modal-header">
        <div class="header-content">
          <mat-icon class="header-icon">info</mat-icon>
          <div>
            <h2 class="modal-title">{{ data.title }}</h2>
            <p class="modal-description">{{ data.description }}</p>
          </div>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="modal-content">
        <div class="section" *ngIf="data.features?.length">
          <h3 class="section-title">
            <mat-icon>star</mat-icon>
            Funcionalidades principales
          </h3>
          <ul class="features-list">
            <li *ngFor="let feature of data.features" class="feature-item">
              <mat-icon class="feature-icon">check_circle</mat-icon>
              {{ feature }}
            </li>
          </ul>
        </div>

        <div class="section" *ngIf="data.tips?.length">
          <h3 class="section-title">
            <mat-icon>lightbulb</mat-icon>
            Tips y recomendaciones
          </h3>
          <div class="tips-container">
            <mat-chip-set>
              <mat-chip *ngFor="let tip of data.tips" class="tip-chip">
                <mat-icon matChipAvatar>tips_and_updates</mat-icon>
                {{ tip }}
              </mat-chip>
            </mat-chip-set>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button mat-raised-button color="primary" (click)="close()">
          <mat-icon>thumb_up</mat-icon>
          ¡Entendido!
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .route-info-modal {
      max-width: 550px;
      width: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-content {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex: 1;
    }

    .header-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
      color: #fbbf24;
    }

    .modal-title {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .modal-description {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .close-btn {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }

    .modal-content {
      padding: 24px;
      max-height: 490px;
      overflow-y: auto;
    }

    .section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;

      mat-icon {
        color: #6366f1;
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 0.9rem;
      color: #4b5563;
      line-height: 1.4;
    }

    .feature-icon {
      color: #10b981;
      font-size: 18px;
      height: 18px;
      width: 18px;
      flex-shrink: 0;
    }

    .tips-container {
      mat-chip-set {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .tip-chip {
      background-color: #fef3c7 !important;
      color: #92400e !important;
      font-size: 0.85rem !important;
      padding: 8px 12px !important;
      border-radius: 16px !important;

      mat-icon {
        color: #f59e0b !important;
        font-size: 16px !important;
        height: 16px !important;
        width: 16px !important;
      }
    }

    .modal-footer {
      padding: 16px 24px 24px;
      display: flex;
      justify-content: center;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;

      button {
        min-width: 140px;
        border-radius: 8px;
        font-weight: 500;

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    /* Responsive */
    @media (max-width: 600px) {
      .modal-header {
        padding: 20px 16px 12px;
      }

      .header-content {
        gap: 12px;
      }

      .header-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
      }

      .modal-title {
        font-size: 1.3rem;
      }

      .modal-content {
        padding: 20px 16px;
      }

      .modal-footer {
        padding: 12px 16px 20px;
      }
    }
  `,
  ],
})
export class RouteInfoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RouteInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close()
  }
}
