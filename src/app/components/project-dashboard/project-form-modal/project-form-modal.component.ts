import {Component, inject, Inject} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { Project } from "../../../models/project"
import {uniqueProjectName} from "../../../validators/async/unique-project-name.validator";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: "app-project-form-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./project-form-modal.component.html",
  styleUrl: "./project-form-modal.component.css",
})
export class ProjectFormModalComponent {
  projectForm: FormGroup
  isEditMode = false
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project }
  ) {
    this.isEditMode = !!data?.project;

    this.projectForm = this.fb.group({
      name: [data?.project?.name || "", Validators.required, uniqueProjectName(inject(ProjectService))],
    });

    if (this.isEditMode && data.project) {
      // Si estamos en modo edición, inicializamos el formulario con los datos del proyecto
      this.projectForm.patchValue({
        name: data.project.name
      })
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting = true

      // Simulate API delay
      setTimeout(() => {
        const result = {
          ...this.projectForm.value,
          id: this.data?.project?.id, // Incluimos el ID si estamos editando
        }
        this.isSubmitting = false
        this.dialogRef.close(result)
      }, 1000)
    }
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}
