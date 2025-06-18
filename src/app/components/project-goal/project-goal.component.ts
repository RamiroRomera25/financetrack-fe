import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatMenuModule } from "@angular/material/menu"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { GoalService } from "../../services/goal.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import type { Goal, GoalDTOPost, GoalDTOPut } from "../../models/goal"
import { finalize } from "rxjs/operators"

@Component({
  selector: "app-project-goal",
  templateUrl: "./project-goal.component.html",
  styleUrls: ["./project-goal.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    ProjectSidebarComponent,
  ],
})
export class ProjectGoalComponent implements OnInit {
  goalForm: FormGroup
  goals: Goal[] = []
  filteredGoals: Goal[] = []
  editMode = false
  currentGoalId: number | null = null
  totalGoalAmount = 0
  nearestGoal = ""
  projectId = 0

  // Loading states
  isLoading = false
  isSubmitting = false
  isDeleting = false
  deletingGoalId: number | null = null
  filterValue = ""

  private goalService = inject(GoalService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      objective: ["", Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      endDate: [null, Validators.required],
      notes: [""],
    })
  }

  maxDate: Date = new Date()
  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadGoals()
  }

  loadGoals(): void {
    this.isLoading = true
    this.goalService
      .getGoals(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (data) => {

          this.goals = data.filter(d => this.getTimeRemainingIcon(d.endDate) != "error");
          this.filteredGoals = [...this.goals]
          this.calculateSummary()
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar las metas")
        },
      })
  }

  calculateProgress(): number {
    const quantity = this.goalForm.get("quantity")?.value || 0
    const currentAmount = this.goalForm.get("currentAmount")?.value || 0
    return quantity > 0 ? Math.min(Math.round((currentAmount / quantity) * 100), 100) : 0
  }

  calculateSummary(): void {
    this.totalGoalAmount = this.goals.reduce((total, goal) => total + goal.quantity, 0)

    // Encontrar la meta más cercana a cumplirse
    if (this.goals.length > 0) {
      const sortedByDate = [...this.goals].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      this.nearestGoal = sortedByDate[0].objective
    } else {
      this.nearestGoal = "Ninguna"
    }
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.isSubmitting = true
      const formValue = this.goalForm.value
      const progress = this.calculateProgress()

      if (this.editMode && this.currentGoalId !== null) {
        // Actualizar meta existente
        const goalPut: GoalDTOPut = {
          objective: formValue.objective,
          quantity: formValue.quantity,
          endDate: formValue.endDate,
          notes: formValue.notes,
        }

        this.goalService
          .updateGoal(this.projectId, this.currentGoalId, goalPut)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (updatedGoal) => {
              const index = this.goals.findIndex((goal) => goal.id === this.currentGoalId)
              if (index !== -1) {
                this.snackBarService.sendSuccess("Meta actualizada correctamente")
              }
              this.loadGoals() // Reload goals to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al actualizar la meta")
            },
          })
      } else {
        const goalPost: GoalDTOPost = {
          objective: formValue.objective,
          quantity: formValue.quantity,
          endDate: formValue.endDate,
          notes: formValue.notes,
          projectId: this.projectId,
        }

        this.goalService
          .createGoal(goalPost)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (newGoal) => {
              this.snackBarService.sendSuccess("Meta creada correctamente")
              this.loadGoals() // Reload goals to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al crear la meta")
            },
          })
      }
    }
  }

  editGoal(goal: Goal): void {
    this.editMode = true
    this.currentGoalId = goal.id
    this.goalForm.setValue({
      objective: goal.objective,
      quantity: goal.quantity,
      endDate: new Date(goal.endDate),
      notes: goal.notes || "",
    })
  }

  deleteGoal(id: number): void {
    this.modalService.confirmDelete("meta").subscribe((confirmed) => {
      if (confirmed) {
        this.isDeleting = true
        this.deletingGoalId = id

        this.goalService
          .deleteGoal(this.projectId, id)
          .pipe(
            finalize(() => {
              this.isDeleting = false
              this.deletingGoalId = null
            }),
          )
          .subscribe({
            next: () => {
              this.goals = this.goals.filter((goal) => goal.id !== id)
              this.filteredGoals = [...this.goals]
              this.calculateSummary()
              this.snackBarService.sendSuccess("Meta eliminada correctamente")

              if (this.currentGoalId === id) {
                this.resetForm()
              }
            },
            error: (error) => {
              this.snackBarService.sendError("Error al eliminar la meta")
            },
          })
      }
    })
  }

  cancelEdit(): void {
    this.resetForm()
  }

  resetForm(): void {
    this.goalForm.reset({
      objective: "",
      quantity: null,
      endDate: null ,
      currentAmount: 0,
      notes: "",
    })
    this.editMode = false
    this.currentGoalId = null
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredGoals = this.goals.filter((goal) => goal.objective.toLowerCase().includes(this.filterValue))
  }

  sortGoals(criteria: string): void {
    this.filteredGoals = [...this.goals].sort((a, b) => {
      if (criteria === "endDate-asc") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      } else if (criteria === "endDate-desc") {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      } else if (criteria === "quantity") {
        return b.quantity - a.quantity
      }
      return 0
    })
  }

  getProgressClass(progress: number): string {
    if (progress < 30) {
      return "progress-low"
    } else if (progress < 70) {
      return "progress-medium"
    } else {
      return "progress-high"
    }
  }

  getTimeRemainingClass(endDate: Date): string {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "urgent"
    } else if (diffDays <= 30) {
      return "warning"
    } else {
      return "on-track"
    }
  }

  getTimeRemainingIcon(endDate: Date): string {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "error"
    } else if (diffDays <= 30) {
      return "warning"
    } else {
      return "event_available"
    }
  }

  getTimeRemainingText(endDate: Date): string {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Vencido hace ${Math.abs(diffDays)} días`
    } else if (diffDays === 0) {
      return "Vence hoy"
    } else if (diffDays === 1) {
      return "Vence mañana"
    } else if (diffDays < 30) {
      return `Vence en ${diffDays} días`
    } else {
      const months = Math.floor(diffDays / 30)
      return `Vence en ${months} ${months === 1 ? "mes" : "meses"}`
    }
  }
}
