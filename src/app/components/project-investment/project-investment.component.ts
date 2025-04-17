import {Component, inject} from "@angular/core"
import {CommonModule} from "@angular/common"
import {ActivatedRoute, RouterModule} from "@angular/router"
import {FormBuilder, type FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {MatButtonModule} from "@angular/material/button"
import {MatIconModule} from "@angular/material/icon"
import {MatCardModule} from "@angular/material/card"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatMenuModule} from "@angular/material/menu"
import {MatSnackBarModule} from "@angular/material/snack-bar"
import {MatTabsModule} from "@angular/material/tabs"
import {InvestmentService} from "../../services/investment.service"
import {SnackBarService} from "../../services/snack-bar.service"
import {ModalService} from "../../services/modal.service"
import {Investment, InvestmentDTOPost, InvestmentDTOPut} from "../../models/investment"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component"

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
    ProjectSidebarComponent,
  ],
})
export class ProjectInvestmentComponent {
  investmentForm: FormGroup
  investments: Investment[] = []
  filteredInvestments: Investment[] = []
  editMode = false
  currentInvestmentId: number | null = null
  totalPortfolioValue = 0
  totalChangePercentage = 0
  projectId = 0
  loading = false

  private investmentService = inject(InvestmentService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.investmentForm = this.fb.group({
      tickerSymbol: ["", Validators.required],
      name: ["", Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      change: [0],
      changePercentage: [0],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadInvestments()
  }

  loadInvestments(): void {
    this.loading = true
    this.investmentService.getInvestments(this.projectId).subscribe({
      next: (data) => {
        this.investments = data
        this.filteredInvestments = [...this.investments]
        this.calculatePortfolioTotals()
        this.loading = false
      },
      error: (error) => {
        this.snackBarService.sendError("Error al cargar las inversiones")
        this.loading = false
      },
    })
  }

  calculateTotalValue(): number {
    const quantity = this.investmentForm.get("quantity")?.value || 0
    const price = this.investmentForm.get("price")?.value || 0
    return quantity * price
  }

  calculatePortfolioTotals(): void {
    // TODO: Todo ?
    // this.totalPortfolioValue = this.investments.reduce((total, investment) => total + investment.value, 0)
    //
    // // Calcular el cambio porcentual ponderado
    // const totalInvestment = this.totalPortfolioValue - this.investments.reduce((total, inv) => total + inv.change, 0)
    // const totalChange = this.investments.reduce((total, inv) => total + inv.change, 0)

    // this.totalChangePercentage = totalInvestment > 0 ? (totalChange / totalInvestment) * 100 : 0
  }

  onSubmit(): void {
    if (this.investmentForm.valid) {
      const formValue = this.investmentForm.value
      const value = formValue.quantity * formValue.price

      if (this.editMode && this.currentInvestmentId !== null) {
        // Actualizar inversión existente
        const investmentPut: InvestmentDTOPut = {
          tickerSymbol: formValue.tickerSymbol,
          quantity: formValue.quantity
        }

        this.investmentService.updateInvestment(this.projectId, this.currentInvestmentId, investmentPut).subscribe({
          next: (updatedInvestment) => {
            const index = this.investments.findIndex((inv) => inv.id === this.currentInvestmentId)
            if (index !== -1) {
              // TODO: Push
              // this.investments[index] = {
              //   ...updatedInvestment,
              //   value: value,
              // }
              this.snackBarService.sendSuccess("Inversión actualizada correctamente")
            }
            this.filteredInvestments = [...this.investments]
            this.calculatePortfolioTotals()
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
          projectId: this.projectId
        }

        this.investmentService.createInvestment(investmentPost).subscribe({
          next: (newInvestment) => {
            // TODO: Pushear lista
            // this.investments.push({
            //   ...newInvestment,
            //   value: value,
            // })
            this.snackBarService.sendSuccess("Inversión añadida correctamente")
            this.filteredInvestments = [...this.investments]
            this.calculatePortfolioTotals()
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
    // TODO: Setear form
    // this.investmentForm.setValue({
    //   tickerSymbol: investment.tickerSymbol,
    //   name: investment.name,
    //   quantity: investment.quantity,
    //   price: investment.price,
    //   change: investment.change,
    //   changePercentage: investment.changePercentage,
    // })
  }

  deleteInvestment(id: number): void {
    this.modalService.confirmDelete("inversión").subscribe((confirmed) => {
      if (confirmed) {
        this.investmentService.deleteInvestment(this.projectId, id).subscribe({
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
      name: "",
      quantity: 0,
      price: 0,
      change: 0,
      changePercentage: 0,
    })
    this.editMode = false
    this.currentInvestmentId = null
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredInvestments = this.investments.filter(
      (investment) =>
        // TODO: Investment name
        // investment.name.toLowerCase().includes(filterValue) ||
        investment.tickerSymbol.toLowerCase().includes(filterValue),
    )
  }

  sortInvestments(criteria: string): void {
    // this.filteredInvestments = [...this.investments].sort((a, b) => {
    //   if (criteria === "name") {
    //     return a.name.localeCompare(b.name)
    //   } else if (criteria === "value") {
    //     return b.value - a.value
    //   } else if (criteria === "changePercentage") {
    //     return b.changePercentage - a.changePercentage
    //   }
    //   return 0
    // })
  }
}
