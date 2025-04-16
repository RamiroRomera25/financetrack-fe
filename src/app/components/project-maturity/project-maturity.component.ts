import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatMenuModule } from "@angular/material/menu"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

enum MaturityState {
  SOLVED = "SOLVED",
  ON_WAIT = "ON_WAIT",
  NOTIFICATED = "NOTIFICATED",
  LATE = "LATE",
}

interface MaturityEntity {
  id: number
  quantity: number
  endDate: Date
  state: MaturityState
}

@Component({
  selector: 'app-project-maturity',
  standalone: true,
  imports: [
    ProjectSidebarComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: './project-maturity.component.html',
  styleUrl: './project-maturity.component.css'
})
export class ProjectMaturityComponent {
  maturityForm: FormGroup
  maturityItems: MaturityEntity[] = []
  filteredMaturityItems: MaturityEntity[] = []
  editMode = false
  currentMaturityId: number | null = null
  totalItems = 0
  totalQuantity = 0
  upcomingMaturity = 0

  maturityStates = [
    { value: MaturityState.SOLVED, label: "Resuelto", class: "solved" },
    { value: MaturityState.ON_WAIT, label: "En Espera", class: "on-wait" },
    { value: MaturityState.NOTIFICATED, label: "Notificado", class: "notificated" },
    { value: MaturityState.LATE, label: "Atrasado", class: "late" },
  ]

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.maturityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      endDate: [new Date(), Validators.required],
      state: [MaturityState.ON_WAIT, Validators.required],
    })

    // Datos de ejemplo para mostrar en el mock-up
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    this.maturityItems = [
      {
        id: 1,
        quantity: 100,
        endDate: nextWeek,
        state: MaturityState.ON_WAIT,
      },
      {
        id: 2,
        quantity: 50,
        endDate: nextMonth,
        state: MaturityState.NOTIFICATED,
      },
      {
        id: 3,
        quantity: 75,
        endDate: lastWeek,
        state: MaturityState.LATE,
      },
      {
        id: 4,
        quantity: 200,
        endDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        state: MaturityState.SOLVED,
      },
    ]

    this.filteredMaturityItems = [...this.maturityItems]
    this.calculateSummary()
  }

  ngOnInit(): void {}

  calculateSummary(): void {
    this.totalItems = this.maturityItems.length
    this.totalQuantity = this.maturityItems.reduce((total, item) => total + item.quantity, 0)

    // Calcular proyectos que vencen en los próximos 7 días
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    this.upcomingMaturity = this.maturityItems.filter((item) => {
      const endDate = new Date(item.endDate)
      return endDate >= today && endDate <= nextWeek && item.state !== MaturityState.SOLVED
    }).length
  }

  onSubmit(): void {
    if (this.maturityForm.valid) {
      const formValue = this.maturityForm.value

      if (this.editMode && this.currentMaturityId !== null) {
        // Actualizar madurez existente
        const index = this.maturityItems.findIndex((item) => item.id === this.currentMaturityId)
        if (index !== -1) {
          this.maturityItems[index] = {
            ...formValue,
            id: this.currentMaturityId,
          }
          this.snackBar.open("Madurez actualizada correctamente", "Cerrar", { duration: 3000 })
        }
      } else {
        // Añadir nueva madurez
        const newId = this.maturityItems.length > 0 ? Math.max(...this.maturityItems.map((item) => item.id)) + 1 : 1
        this.maturityItems.push({
          ...formValue,
          id: newId,
        })
        this.snackBar.open("Madurez añadida correctamente", "Cerrar", { duration: 3000 })
      }

      this.filteredMaturityItems = [...this.maturityItems]
      this.calculateSummary()
      this.resetForm()
    }
  }

  editMaturity(item: MaturityEntity): void {
    this.editMode = true
    this.currentMaturityId = item.id
    this.maturityForm.setValue({
      quantity: item.quantity,
      endDate: item.endDate,
      state: item.state,
    })
  }

  deleteMaturity(id: number): void {
    this.maturityItems = this.maturityItems.filter((item) => item.id !== id)
    this.filteredMaturityItems = [...this.maturityItems]
    this.calculateSummary()
    this.snackBar.open("Madurez eliminada correctamente", "Cerrar", { duration: 3000 })

    if (this.currentMaturityId === id) {
      this.resetForm()
    }
  }

  cancelEdit(): void {
    this.resetForm()
  }

  resetForm(): void {
    this.maturityForm.reset({
      quantity: 1,
      endDate: new Date(),
      state: MaturityState.ON_WAIT,
    })
    this.editMode = false
    this.currentMaturityId = null
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredMaturityItems = this.maturityItems.filter((item) => item.id.toString().includes(filterValue))
  }

  filterByState(state: string): void {
    if (state === "ALL") {
      this.filteredMaturityItems = [...this.maturityItems]
    } else {
      this.filteredMaturityItems = this.maturityItems.filter((item) => item.state === state)
    }
  }

  sortMaturityItems(criteria: string): void {
    this.filteredMaturityItems = [...this.maturityItems].sort((a, b) => {
      if (criteria === "endDate") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      } else if (criteria === "quantity") {
        return b.quantity - a.quantity
      } else if (criteria === "state") {
        return a.state.localeCompare(b.state)
      }
      return 0
    })
  }

  getStateClass(state: MaturityState): string {
    switch (state) {
      case MaturityState.SOLVED:
        return "solved"
      case MaturityState.ON_WAIT:
        return "on-wait"
      case MaturityState.NOTIFICATED:
        return "notificated"
      case MaturityState.LATE:
        return "late"
      default:
        return ""
    }
  }

  getStateLabel(state: MaturityState): string {
    const stateObj = this.maturityStates.find((s) => s.value === state)
    return stateObj ? stateObj.label : state
  }

  getDaysRemainingClass(endDate: Date): string {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "expired"
    } else if (diffDays <= 7) {
      return "warning"
    } else {
      return "on-time"
    }
  }

  getDaysRemainingIcon(endDate: Date): string {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "error"
    } else if (diffDays <= 7) {
      return "warning"
    } else {
      return "event_available"
    }
  }

  getDaysRemainingText(endDate: Date): string {
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
    } else {
      return `Vence en ${diffDays} días`
    }
  }
}

