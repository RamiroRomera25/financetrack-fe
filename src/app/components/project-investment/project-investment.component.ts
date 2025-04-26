import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatMenuModule } from "@angular/material/menu"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { InvestmentService } from "../../services/investment.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import type { Investment, InvestmentDTOPost, InvestmentDTOPut } from "../../models/investment"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { finalize } from "rxjs/operators"

@Component({
  selector: "app-investments",
  templateUrl: "./project-investment.component.html",
  styleUrls: ["./project-investment.component.css"],
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
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ProjectSidebarComponent,
  ],
})
export class ProjectInvestmentComponent implements OnInit {
  investmentForm: FormGroup
  investments: Investment[] = []
  filteredInvestments: Investment[] = []
  editMode = false
  currentInvestmentId: number | null = null
  totalPortfolioValue = 0
  totalChangePercentage = 0
  projectId = 0

  // Loading states
  isLoading = false
  isSubmitting = false
  isDeleting = false
  deletingInvestmentId: number | null = null
  searchTerm = ""

  private investmentService = inject(InvestmentService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.investmentForm = this.fb.group({
      tickerSymbol: ["", Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadInvestments()
  }

  loadInvestments(): void {
    this.isLoading = true
    this.investmentService
      .getInvestments(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.investments = data
          this.filteredInvestments = [...this.investments]
          this.calculatePortfolioTotals()
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar las inversiones")
        },
      })
  }

  calculatePortfolioTotals(): void {
    // TODO: Todo ?
    this.totalPortfolioValue = this.investments.reduce((total, investment) => total + investment.value, 0)

    // Calcular el cambio porcentual ponderado
    const totalInvestment = this.totalPortfolioValue - this.investments.reduce((total, inv) => total + inv.change, 0)
    const totalChange = this.investments.reduce((total, inv) => total + inv.change, 0)

    this.totalChangePercentage = totalInvestment > 0 ? (totalChange / totalInvestment) * 100 : 0
  }

  onSubmit(): void {
    if (this.investmentForm.valid) {
      this.isSubmitting = true
      const formValue = this.investmentForm.value

      if (this.editMode && this.currentInvestmentId !== null) {
        // Actualizar inversión existente
        const investmentPut: InvestmentDTOPut = {
          quantity: formValue.quantity,
        }

        this.investmentService
          .updateInvestment(this.projectId, this.currentInvestmentId, investmentPut)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (updatedInvestment) => {
              this.snackBarService.sendSuccess("Inversión actualizada correctamente")
              this.loadInvestments() // Reload investments to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al actualizar la inversión")
            },
          })
      } else {
        // Añadir nueva inversión
        const investmentPost: InvestmentDTOPost = {
          tickerSymbol: formValue.tickerSymbol,
          quantity: formValue.quantity,
          projectId: this.projectId,
        }

        this.investmentService
          .createInvestment(investmentPost)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (newInvestment) => {
              this.snackBarService.sendSuccess("Inversión añadida correctamente")
              this.loadInvestments() // Reload investments to ensure data consistency
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al añadir la inversión")
            },
          })
      }
    }
  }

  editInvestment(investment: Investment): void {
    this.editMode = true
    this.currentInvestmentId = investment.id
    this.investmentForm.setValue({
      tickerSymbol: investment.tickerSymbol,
      quantity: investment.quantity,
    })
  }

  deleteInvestment(id: number): void {
    this.modalService.confirmDelete("inversión").subscribe((confirmed) => {
      if (confirmed) {
        this.isDeleting = true
        this.deletingInvestmentId = id

        this.investmentService
          .deleteInvestment(this.projectId, id)
          .pipe(
            finalize(() => {
              this.isDeleting = false
              this.deletingInvestmentId = null
            }),
          )
          .subscribe({
            next: () => {
              this.investments = this.investments.filter((inv) => inv.id !== id)
              this.filteredInvestments = [...this.investments]
              this.calculatePortfolioTotals()
              this.snackBarService.sendSuccess("Inversión eliminada correctamente")

              if (this.currentInvestmentId === id) {
                this.resetForm()
              }
            },
            error: (error) => {
              this.snackBarService.sendError("Error al eliminar la inversión")
            },
          })
      }
    })
  }

  cancelEdit(): void {
    this.resetForm()
  }

  resetForm(): void {
    this.investmentForm.reset({
      tickerSymbol: "",
      quantity: 0,
    })
    this.editMode = false
    this.currentInvestmentId = null
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredInvestments = this.investments.filter(
      (investment) =>
        investment.name.toLowerCase().includes(this.searchTerm) ||
        investment.tickerSymbol.toLowerCase().includes(this.searchTerm),
    )
  }

  sortInvestments(criteria: string): void {
    this.filteredInvestments = [...this.investments].sort((a, b) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name)
      } else if (criteria === "value") {
        return b.value - a.value
      } else if (criteria === "changePercentage") {
        return b.changePercentage - a.changePercentage
      }
      return 0
    })
  }
}
