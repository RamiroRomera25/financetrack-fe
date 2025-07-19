import { Component, Input, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { TutorialService } from "../../services/tutorial.service"

@Component({
  selector: "app-tutorial-fab",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-fab
      color="accent"
      class="tutorial-fab"
      [matTooltip]="tooltipText"
      matTooltipPosition="left"
      (click)="startTutorial()">
      <mat-icon>help</mat-icon>
    </button>
  `,
  styles: [
    `
    .tutorial-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
      color: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }

    .tutorial-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(0,0,0,0.4);
    }

    .tutorial-fab mat-icon {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    @media (max-width: 768px) {
      .tutorial-fab {
        bottom: 80px;
        right: 16px;
        transform: scale(0.9);
      }
    }
  `,
  ],
})
export class TutorialFabComponent {
  @Input() tutorialName = ""
  @Input() tooltipText = "Iniciar tutorial"

  private tutorialService = inject(TutorialService)

  startTutorial() {
    if (this.tutorialName) {
      this.tutorialService.startTutorial(this.tutorialName)
    }
  }
}
