import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
@Component({
  selector: 'app-project-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './project-form-modal.component.html',
  styleUrl: './project-form-modal.component.css'
})
export class ProjectFormModalComponent {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group({
      name: ["", Validators.required],
    })
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value)
    }
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}

