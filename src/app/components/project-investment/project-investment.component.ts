import { Component, type OnInit } from "@angular/core"
import {CommonModule, NgClass} from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatMenuModule } from "@angular/material/menu"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatTabsModule } from "@angular/material/tabs"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

interface Investment {
  id: number
  tickerSymbol: string
  name: string
  quantity: number
  price: number
  value: number
  change: number
  changePercentage: number
}

@Component({
  selector: 'app-project-investment',
  standalone: true,
  imports: [
    ProjectSidebarComponent,
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
    NgClass,
  ],
  templateUrl: './project-investment.component.html',
  styleUrl: './project-investment.component.css'
})
export class ProjectInvestmentComponent {
  investmentForm: FormGroup
  investments: Investment[] = []
  filteredInvestments: Investment[] = []
  editMode = false
  currentInvestmentId: number | null = null
  totalPortfolioValue = 0
  totalChangePercentage = 0

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.investmentForm = this.fb.group({
      tickerSymbol: ["", Validators.required],
      name: ["", Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      change: [0],
      changePercentage: [0],
    })

    // Datos de ejemplo para mostrar en el mock-up
    this.investments = [
      {
        id: 1,
        tickerSymbol: "AAPL",
        name: "Apple Inc.",
        quantity: 10,
        price: 150.25,
        value: 1502.5,
        change: 15.75,
        changePercentage: 1.05,
      },
      {
        id: 2,
        tickerSymbol: "MSFT",
        name: "Microsoft Corporation",
        quantity: 5,
        price: 290.1,
        value: 1450.5,
        change: 25.3,
        changePercentage: 1.75,
      },
      {
        id: 3,
        tickerSymbol: "AMZN",
        name: "Amazon.com, Inc.",
        quantity: 2,
        price: 3200.5,
        value: 6401.0,
        change: -45.2,
        changePercentage: -0.7,
      },
      {
        id: 4,
        tickerSymbol: "GOOGL",
        name: "Alphabet Inc.",
        quantity: 3,
        price: 2750.75,
        value: 8252.25,
        change: 32.15,
        changePercentage: 0.39,
      },
    ]

    this.filteredInvestments = [...this.investments]
    this.calculatePortfolioTotals()
  }

  ngOnInit(): void {}

  calculateTotalValue(): number {
    const quantity = this.investmentForm.get("quantity")?.value || 0
    const price = this.investmentForm.get("price")?.value || 0
    return quantity * price
  }

  calculatePortfolioTotals(): void {
    this.totalPortfolioValue = this.investments.reduce((total, investment) => total + investment.value, 0)

    // Calcular el cambio porcentual ponderado
    const totalInvestment = this.totalPortfolioValue - this.investments.reduce((total, inv) => total + inv.change, 0)
    const totalChange = this.investments.reduce((total, inv) => total + inv.change, 0)

    this.totalChangePercentage = totalInvestment > 0 ? (totalChange / totalInvestment) * 100 : 0
  }

  onSubmit(): void {
    if (this.investmentForm.valid) {
      const formValue = this.investmentForm.value
      const value = formValue.quantity * formValue.price

      if (this.editMode && this.currentInvestmentId !== null) {
        // Actualizar inversión existente
        const index = this.investments.findIndex((inv) => inv.id === this.currentInvestmentId)
        if (index !== -1) {
          this.investments[index] = {
            ...formValue,
            id: this.currentInvestmentId,
            value: value,
          }
          this.snackBar.open("Inversión actualizada correctamente", "Cerrar", { duration: 3000 })
        }
      } else {
        // Añadir nueva inversión
        const newId = this.investments.length > 0 ? Math.max(...this.investments.map((inv) => inv.id)) + 1 : 1
        this.investments.push({
          ...formValue,
          id: newId,
          value: value,
        })
        this.snackBar.open("Inversión añadida correctamente", "Cerrar", { duration: 3000 })
      }

      this.filteredInvestments = [...this.investments]
      this.calculatePortfolioTotals()
      this.resetForm()
    }
  }

  editInvestment(investment: Investment): void {
    this.editMode = true
    this.currentInvestmentId = investment.id
    this.investmentForm.setValue({
      tickerSymbol: investment.tickerSymbol,
      name: investment.name,
      quantity: investment.quantity,
      price: investment.price,
      change: investment.change,
      changePercentage: investment.changePercentage,
    })
  }

  deleteInvestment(id: number): void {
    this.investments = this.investments.filter((inv) => inv.id !== id)
    this.filteredInvestments = [...this.investments]
    this.calculatePortfolioTotals()
    this.snackBar.open("Inversión eliminada correctamente", "Cerrar", { duration: 3000 })

    if (this.currentInvestmentId === id) {
      this.resetForm()
    }
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
        investment.name.toLowerCase().includes(filterValue) ||
        investment.tickerSymbol.toLowerCase().includes(filterValue),
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

