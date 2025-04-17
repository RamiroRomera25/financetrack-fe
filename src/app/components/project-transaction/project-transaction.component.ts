import {Component} from "@angular/core"
import {CommonModule} from "@angular/common"
import {MatCardModule} from "@angular/material/card"
import {MatIconModule} from "@angular/material/icon"
import {MatButtonModule} from "@angular/material/button"
import {MatInputModule} from "@angular/material/input"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatSelectModule} from "@angular/material/select"
import {MatDatepickerModule} from "@angular/material/datepicker"
import {MatNativeDateModule} from "@angular/material/core"
import {MatDividerModule} from "@angular/material/divider"
import {MatTableModule} from "@angular/material/table"
import {MatSortModule} from "@angular/material/sort"
import {MatPaginatorModule} from "@angular/material/paginator"
import {MatChipsModule} from "@angular/material/chips"
import {MatRadioModule} from "@angular/material/radio"
import {MatTooltipModule} from "@angular/material/tooltip"
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

interface Category {
  id: number
  name: string
  color: string
}

interface Transaction {
  id: number
  date: Date
  description: string
  quantity: number
  type: "income" | "expense"
  category: Category
}

@Component({
  selector: 'app-project-transaction',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatRadioModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectSidebarComponent,
  ],
  templateUrl: './project-transaction.component.html',
  styleUrl: './project-transaction.component.css'
})
export class ProjectTransactionComponent {
  transactionForm: FormGroup
  transactions: Transaction[] = []
  categories: Category[] = []
  displayedColumns: string[] = ["date", "description", "category", "quantity", "actions"]

  // Filter options
  filterType: "all" | "income" | "expense" = "all"
  filterCategory: number | null = null

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      description: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      type: ["expense", Validators.required],
      category: [null, Validators.required],
      date: [new Date(), Validators.required],
    })
  }

  ngOnInit(): void {
    // Load mock data
    this.loadMockCategories()
    this.loadMockTransactions()
  }

  loadMockCategories(): void {
    this.categories = [
      { id: 1, name: "Alimentación", color: "#FF5722" },
      { id: 2, name: "Transporte", color: "#2196F3" },
      { id: 3, name: "Vivienda", color: "#4CAF50" },
      { id: 4, name: "Entretenimiento", color: "#9C27B0" },
      { id: 5, name: "Salud", color: "#F44336" },
      { id: 6, name: "Educación", color: "#3F51B5" },
      { id: 7, name: "Ropa", color: "#E91E63" },
      { id: 8, name: "Tecnología", color: "#607D8B" },
      { id: 9, name: "Ingresos", color: "#0a7c43" },
      { id: 10, name: "Inversiones", color: "#FFC107" },
    ]
  }

  loadMockTransactions(): void {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        date: new Date(2025, 3, 15),
        description: "Compra supermercado",
        quantity: 120,
        type: "expense",
        category: this.categories[0], // Alimentación
      },
      {
        id: 2,
        date: new Date(2025, 3, 14),
        description: "Salario mensual",
        quantity: 2500,
        type: "income",
        category: this.categories[8], // Ingresos
      },
      {
        id: 3,
        date: new Date(2025, 3, 12),
        description: "Alquiler",
        quantity: 800,
        type: "expense",
        category: this.categories[2], // Vivienda
      },
      {
        id: 4,
        date: new Date(2025, 3, 10),
        description: "Cine y cena",
        quantity: 85,
        type: "expense",
        category: this.categories[3], // Entretenimiento
      },
      {
        id: 5,
        date: new Date(2025, 3, 8),
        description: "Gasolina",
        quantity: 60,
        type: "expense",
        category: this.categories[1], // Transporte
      },
      {
        id: 6,
        date: new Date(2025, 3, 5),
        description: "Consulta médica",
        quantity: 50,
        type: "expense",
        category: this.categories[4], // Salud
      },
      {
        id: 7,
        date: new Date(2025, 3, 3),
        description: "Curso online",
        quantity: 200,
        type: "expense",
        category: this.categories[5], // Educación
      },
      {
        id: 8,
        date: new Date(2025, 3, 1),
        description: "Dividendos",
        quantity: 150,
        type: "income",
        category: this.categories[9], // Inversiones
      },
    ]

    this.transactions = mockTransactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value
      const category = this.categories.find(c => c.id === formValue.category)

      if (!category) {
        return
      }

      const newTransaction: Transaction = {
        id: this.transactions.length + 1,
        date: formValue.date,
        description: formValue.description,
        quantity: formValue.quantity,
        type: formValue.type,
        category: category,
      }

      this.transactions.unshift(newTransaction)
      this.resetForm()
    }
  }

  resetForm(): void {
    this.transactionForm.reset({
      description: "",
      quantity: null,
      type: "expense",
      category: null,
      date: new Date(),
    })
  }

  deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(t => t.id !== id)
  }

  editTransaction(transaction: Transaction): void {
    // In a real application, this would populate the form for editing
    console.log("Edit transaction:", transaction)
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-ES").format(date)
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
  }

  getFilteredTransactions(): Transaction[] {
    return this.transactions.filter(transaction => {
      // Filter by type
      if (this.filterType !== "all" && transaction.type !== this.filterType) {
        return false
      }

      // Filter by category
      if (this.filterCategory !== null && transaction.category.id !== this.filterCategory) {
        return false
      }

      return true
    })
  }

  clearFilters(): void {
    this.filterType = "all"
    this.filterCategory = null
  }

  getTotalBalance(): number {
    return this.transactions.reduce((total, transaction) => {
      return total + (transaction.type === "income" ? transaction.quantity : -transaction.quantity)
    }, 0)
  }

  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === "income")
      .reduce((total, transaction) => total + transaction.quantity, 0)
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === "expense")
      .reduce((total, transaction) => total + transaction.quantity, 0)
  }
}

