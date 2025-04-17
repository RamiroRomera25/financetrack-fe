import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatMenuModule } from "@angular/material/menu"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { ActivatedRoute } from "@angular/router"
import { GoalService } from "../../services/goal.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import {Goal, GoalDTOPost, GoalDTOPut} from "../../models/goal";

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
  loading = false

  private goalService = inject(GoalService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      objective: ["", Validators.required],
      quantity: [1000, [Validators.required, Validators.min(1)]],
      endDate: [new Date(new Date().setMonth(new Date().getMonth() + 6)), Validators.required],
      currentAmount: [0, [Validators.min(0)]],
      notes: [""],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadGoals()
  }

  loadGoals(): void {
    this.loading = true
    this.goalService.getGoals(this.projectId).subscribe({
      next: (data) => {
        // Add progress calculation since it might not be in the API response
        this.goals = data.map((goal) => ({
          ...goal,
          // progress: goal.quantity > 0 ? Math.min(Math.round((goal.currentAmount / goal.quantity) * 100), 100) : 0,
        }))
        this.filteredGoals = [...this.goals]
        this.calculateSummary()
        this.loading = false
      },
      error: (error) => {
        this.snackBarService.sendError("Error al cargar las metas")
        this.loading = false
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
      const formValue = this.goalForm.value
      const progress = this.calculateProgress()

      if (this.editMode && this.currentGoalId !== null) {
        // Actualizar meta existente
        const goalPut: GoalDTOPut = {
          objective: formValue.objective,
          quantity: formValue.quantity,
          endDate: formValue.endDate,
        }

        this.goalService.updateGoal(this.projectId, this.currentGoalId, goalPut).subscribe({
          next: (updatedGoal) => {
            const index = this.goals.findIndex((goal) => goal.id === this.currentGoalId)
            if (index !== -1) {
              // TODO: Pushear Value form
              // this.goals[index] = {
              //   ...updatedGoal,
              //   progress: progress,
              //   notes: formValue.notes,
              //   currentAmount: formValue.currentAmount,
              // }
              this.snackBarService.sendSuccess("Meta actualizada correctamente")
            }
            this.filteredGoals = [...this.goals]
            this.calculateSummary()
            this.resetForm()
          },
          error: (error) => {
            this.snackBarService.sendError("Error al actualizar la meta")
          },
        })
      } else {
        // TODO: Añadir nueva meta
        const goalPost: GoalDTOPost = {
          endDate: new Date(), objective: "", projectId: 0, quantity: 0
        };
        // const goalPost: GoalDTOPost = {
        //   objective: formValue.objective,
        //   quantity: formValue.quantity,
        //   endDate: formValue.endDate,
        //   currentAmount: formValue.currentAmount,
        //   notes: formValue.notes,
        //   projectId: this.projectId,
        // }

        this.goalService.createGoal(goalPost).subscribe({
          next: (newGoal) => {
            // TODO: Pushear
            // this.goals.push({
            //   ...newGoal,
            //   progress: progress,
            //   currentAmount: formValue.currentAmount,
            //   notes: formValue.notes,
            // })
            this.snackBarService.sendSuccess("Meta creada correctamente")
            this.filteredGoals = [...this.goals]
            this.calculateSummary()
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
    // TODO: Set Value form
    // this.goalForm.setValue({
    //   objective: goal.objective,
    //   quantity: goal.quantity,
    //   endDate: new Date(goal.endDate),
    //   currentAmount: goal.currentAmount,
    //   notes: goal.notes || "",
    // })
  }

  deleteGoal(id: number): void {
    this.modalService.confirmDelete("meta").subscribe((confirmed) => {
      if (confirmed) {
        this.goalService.deleteGoal(this.projectId, id).subscribe({
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
      quantity: 1000,
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      currentAmount: 0,
      notes: "",
    })
    this.editMode = false
    this.currentGoalId = null
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredGoals = this.goals.filter((goal) => goal.objective.toLowerCase().includes(filterValue))
  }

  sortGoals(criteria: string): void {
    this.filteredGoals = [...this.goals].sort((a, b) => {
      if (criteria === "endDate") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
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
