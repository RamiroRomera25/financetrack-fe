import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatMenuModule } from "@angular/material/menu"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MaturityService } from "../../services/maturity.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import type { Maturity, MaturityDTOPost, MaturityDTOPut } from "../../models/maturity"
import { MaturityState } from "../../models/maturity"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { finalize } from "rxjs/operators"

@Component({
  selector: "app-project-maturity",
  templateUrl: "./project-maturity.component.html",
  styleUrls: ["./project-maturity.component.css"],
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ProjectSidebarComponent,
  ],
})
export class ProjectMaturityComponent implements OnInit {
  maturityForm: FormGroup
  maturityItems: Maturity[] = []
  filteredMaturityItems: Maturity[] = []
  editMode = false
  currentMaturityId: number | null = null
  totalItems = 0
  totalQuantity = 0
  upcomingMaturity = 0
  projectId = 0

  // Loading states
  isLoading = false
  isSubmitting = false
  isDeleting = false
  deletingMaturityId: number | null = null
  searchTerm = ""

  maturityStates = [
    { value: MaturityState.SOLVED, label: "Resuelto", class: "solved" },
    { value: MaturityState.ON_WAIT, label: "En Espera", class: "on-wait" },
    { value: MaturityState.NOTIFICATED, label: "Notificado", class: "notificated" },
    { value: MaturityState.LATE, label: "Atrasado", class: "late" },
  ]

  private maturityService = inject(MaturityService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.maturityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      endDate: [new Date(), Validators.required],
      state: [""],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadMaturities()
  }

  loadMaturities(): void {
    this.isLoading = true
    this.maturityService
      .getMaturities(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.maturityItems = data
          this.filteredMaturityItems = [...this.maturityItems]
          this.calculateSummary()
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar los vencimientos")
        },
      })
  }

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
      this.isSubmitting = true
      const formValue = this.maturityForm.value

      if (this.editMode && this.currentMaturityId !== null) {
        // Actualizar vencimiento existente
        const maturityPut: MaturityDTOPut = {
          quantity: formValue.quantity,
          endDate: formValue.endDate,
          state: formValue.state,
        }

        this.maturityService
          .updateMaturity(this.projectId, this.currentMaturityId, maturityPut)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (updatedMaturity) => {
              this.snackBarService.sendSuccess("Vencimiento actualizado correctamente")
              this.loadMaturities() // Reload maturities to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al actualizar el vencimiento")
            },
          })
      } else {
        const maturityPost: MaturityDTOPost = {
          quantity: formValue.quantity,
          endDate: formValue.endDate,
          projectId: this.projectId,
        }

        this.maturityService
          .createMaturity(maturityPost)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (newMaturity) => {
              this.snackBarService.sendSuccess("Vencimiento añadido correctamente")
              this.loadMaturities() // Reload maturities to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al añadir el vencimiento")
            },
          })
      }
    }
  }

  editMaturity(item: Maturity): void {
    this.editMode = true
    this.currentMaturityId = item.id
    this.maturityForm.controls["state"].addValidators(Validators.required)
    this.maturityForm.setValue({
      quantity: item.quantity,
      endDate: new Date(item.endDate),
      state: item.state,
    })
  }

  deleteMaturity(id: number): void {
    this.modalService.confirmDelete("vencimiento").subscribe((confirmed) => {
      if (confirmed) {
        this.isDeleting = true
        this.deletingMaturityId = id

        this.maturityService
          .deleteMaturity(this.projectId, id)
          .pipe(
            finalize(() => {
              this.isDeleting = false
              this.deletingMaturityId = null
            }),
          )
          .subscribe({
            next: () => {
              this.maturityItems = this.maturityItems.filter((item) => item.id !== id)
              this.filteredMaturityItems = [...this.maturityItems]
              this.calculateSummary()
              this.snackBarService.sendSuccess("Vencimiento eliminado correctamente")

              if (this.currentMaturityId === id) {
                this.resetForm()
              }
            },
            error: (error) => {
              this.snackBarService.sendError("Error al eliminar el vencimiento")
            },
          })
      }
    })
  }

  cancelEdit(): void {
    this.maturityForm.controls["state"].removeValidators(Validators.required)
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
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredMaturityItems = this.maturityItems.filter((item) => item.id.toString().includes(this.searchTerm))
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

  getStateLabel(state: MaturityState) {
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
