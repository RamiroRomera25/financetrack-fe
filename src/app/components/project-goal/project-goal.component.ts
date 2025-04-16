import { Component, type OnInit } from "@angular/core"
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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

interface GoalEntity {
  id: number
  objective: string
  endDate: Date
  quantity: number
  currentAmount: number
  progress: number
  notes?: string
}

@Component({
  selector: "app-project-goal",
  templateUrl: "./project-goal.component.html",
  styleUrl: "./project-goal.component.css",
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
  goals: GoalEntity[] = []
  filteredGoals: GoalEntity[] = []
  editMode = false
  currentGoalId: number | null = null
  totalGoalAmount = 0
  nearestGoal = ""

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.goalForm = this.fb.group({
      objective: ["", Validators.required],
      quantity: [1000, [Validators.required, Validators.min(1)]],
      endDate: [new Date(new Date().setMonth(new Date().getMonth() + 6)), Validators.required],
      currentAmount: [0, [Validators.min(0)]],
      notes: [""],
    })

    // Datos de ejemplo para mostrar en el mock-up
    const today = new Date()
    const threeMonths = new Date(today)
    threeMonths.setMonth(today.getMonth() + 3)
    const sixMonths = new Date(today)
    sixMonths.setMonth(today.getMonth() + 6)
    const oneYear = new Date(today)
    oneYear.setFullYear(today.getFullYear() + 1)

    this.goals = [
      {
        id: 1,
        objective: "Fondo de emergencia",
        endDate: threeMonths,
        quantity: 5000,
        currentAmount: 2500,
        progress: 50,
        notes: "Ahorrar para cubrir 3 meses de gastos básicos",
      },
      {
        id: 2,
        objective: "Vacaciones",
        endDate: sixMonths,
        quantity: 3000,
        currentAmount: 1200,
        progress: 40,
        notes: "Viaje a la playa con la familia",
      },
      {
        id: 3,
        objective: "Entrada para vivienda",
        endDate: oneYear,
        quantity: 20000,
        currentAmount: 5000,
        progress: 25,
      },
      {
        id: 4,
        objective: "Nuevo laptop",
        endDate: threeMonths,
        quantity: 1500,
        currentAmount: 1350,
        progress: 90,
      },
    ]

    this.filteredGoals = [...this.goals]
    this.calculateSummary()
  }

  ngOnInit(): void {}

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
      const progress =
        formValue.quantity > 0 ? Math.min(Math.round((formValue.currentAmount / formValue.quantity) * 100), 100) : 0

      if (this.editMode && this.currentGoalId !== null) {
        // Actualizar meta existente
        const index = this.goals.findIndex((goal) => goal.id === this.currentGoalId)
        if (index !== -1) {
          this.goals[index] = {
            ...formValue,
            id: this.currentGoalId,
            progress: progress,
          }
          this.snackBar.open("Meta actualizada correctamente", "Cerrar", { duration: 3000 })
        }
      } else {
        // Añadir nueva meta
        const newId = this.goals.length > 0 ? Math.max(...this.goals.map((goal) => goal.id)) + 1 : 1
        this.goals.push({
          ...formValue,
          id: newId,
          progress: progress,
        })
        this.snackBar.open("Meta creada correctamente", "Cerrar", { duration: 3000 })
      }

      this.filteredGoals = [...this.goals]
      this.calculateSummary()
      this.resetForm()
    }
  }

  editGoal(goal: GoalEntity): void {
    this.editMode = true
    this.currentGoalId = goal.id
    this.goalForm.setValue({
      objective: goal.objective,
      quantity: goal.quantity,
      endDate: new Date(goal.endDate),
      currentAmount: goal.currentAmount,
      notes: goal.notes || "",
    })
  }

  deleteGoal(id: number): void {
    this.goals = this.goals.filter((goal) => goal.id !== id)
    this.filteredGoals = [...this.goals]
    this.calculateSummary()
    this.snackBar.open("Meta eliminada correctamente", "Cerrar", { duration: 3000 })

    if (this.currentGoalId === id) {
      this.resetForm()
    }
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
      } else if (criteria === "progress") {
        return b.progress - a.progress
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
