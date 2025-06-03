import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatRadioModule } from "@angular/material/radio"
import { FormsModule } from "@angular/forms"
import { MatDividerModule } from "@angular/material/divider"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-import-categories-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: "./import-categories-modal.component.html",
  styleUrls: ["./import-categories-modal.component.css"],
})
export class ImportCategoriesModalComponent {
  selectedProject: any = null;

  constructor(
    public dialogRef: MatDialogRef<ImportCategoriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projects: any[] }
  ) { }

  onCancel(): void {
    this.dialogRef.close()
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedProject)
  }

  getCategoryCount(project: any): number {
    return project.categories ? project.categories.length : 0
  }
}
