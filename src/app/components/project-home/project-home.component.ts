import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTableModule } from "@angular/material/table"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { ActivatedRoute } from "@angular/router"
import type { ChartConfiguration, ChartData, ChartType, TooltipItem } from "chart.js"
import { BaseChartDirective } from "ng2-charts"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { ProjectService } from "../../services/project.service"
import { SnackBarService } from "../../services/snack-bar.service"
import type { Project } from "../../models/project"
import type { Category } from "../../models/category"
import type { Goal } from "../../models/goal"
import type { Investment } from "../../models/investment"
import type { Maturity } from "../../models/maturity"
import type { Transaction } from "../../models/transaction"
import { finalize } from "rxjs/operators"
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field"
import { MatOption } from "@angular/material/core"
import { MatSelect } from "@angular/material/select"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import { MatInput } from "@angular/material/input"
import { MatChipSet, MatChip } from "@angular/material/chips"
import { MatDatepickerModule } from "@angular/material/datepicker"

interface CategorySummary {
  id: number
  name: string
  color: string
  amount: number
  percentage: number
}

interface TransactionDisplay {
  id: number
  date: Date
  description: string
  amount: number
  category: string
  categoryColor: string
}

interface GoalDisplay {
  id: number
  objective: string
  endDate: Date
  targetAmount: number
}

interface InvestmentDisplay {
  id: number
  tickerSymbol: string
  name: string
  quantity: number
  price: number
  value: number
  change: number
  changePercentage: number
}

interface MaturityDisplay {
  id: number
  description: string
  amount: number
  endDate: Date
  daysLeft: number
  state: "PENDING" | "COMPLETED" | "OVERDUE"
}

@Component({
  selector: "app-project-home",
  standalone: true,
  templateUrl: "./project-home.component.html",
  styleUrl: "./project-home.component.css",
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BaseChartDirective,
    ProjectSidebarComponent,
    MatFormField,
    MatOption,
    MatSelect,
    FormsModule,
    MatLabel,
    MatInput,
    MatChipSet,
    MatChip,
    MatDatepickerModule,
    MatError,
    MatPrefix,
    MatSuffix,
    ReactiveFormsModule,
  ],
})
export class ProjectHomeComponent implements OnInit {
  // Project data
  project: Project | null = null
  projectId = 0
  isLoading = false

  // Original unfiltered data
  private originalProject: Project | null = null
  private originalTransactions: Transaction[] = []
  private originalGoals: Goal[] = []
  private originalInvestments: Investment[] = []
  private originalMaturities: Maturity[] = []
  private originalReminders: any[] = []

  // Financial summary
  totalBalance = 0
  totalIncome = 0
  totalExpenses = 0
  savingsRate = 0

  // Transactions
  recentTransactions: TransactionDisplay[] = []
  displayedColumns: string[] = ["date", "description", "category", "amount"]

  // Categories
  categories: CategorySummary[] = []
  incomeCategories: CategorySummary[] = []

  // Goals
  goals: GoalDisplay[] = []

  // Investments
  investments: InvestmentDisplay[] = []
  investmentTotal = 0
  investmentChange = 0
  investmentChangePercentage = 0

  // Maturities
  upcomingMaturities: MaturityDisplay[] = []

  // Filter properties
  dateFrom: Date | null = null
  dateTo: Date | null = null
  selectedCategory: Category | null = null
  categoriesAvailable: Category[] = []

  // Charts configuration
  public incomeExpensePieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || ""
            const value = context.raw as number
            const dataArray = context.dataset.data || []
            let total = 0
            for (let i = 0; i < dataArray.length; i++) {
              const item = dataArray[i]
              if (typeof item === "number") {
                total += item
              }
            }
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${this.formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  public incomeExpensePieChartType: ChartType = "pie"
  public incomeExpensePieChartData: ChartData<"pie"> = {
    labels: ["Ingresos", "Gastos"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  }

  public expensePieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || ""
            const value = context.raw as number
            const dataArray = context.dataset.data || []
            let total = 0
            for (let i = 0; i < dataArray.length; i++) {
              const item = dataArray[i]
              if (typeof item === "number") {
                total += item
              }
            }
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${this.formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  public expensePieChartType: ChartType = "pie"
  public expensePieChartData: ChartData<"pie"> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  }

  public incomePieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || ""
            const value = context.raw as number
            const dataArray = context.dataset.data || []
            let total = 0
            for (let i = 0; i < dataArray.length; i++) {
              const item = dataArray[i]
              if (typeof item === "number") {
                total += item
              }
            }
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${this.formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  public incomePieChartType: ChartType = "pie"
  public incomePieChartData: ChartData<"pie"> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  }

  private route = inject(ActivatedRoute)
  private projectService = inject(ProjectService)
  private snackBarService = inject(SnackBarService)

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadProjectData()
  }

  loadProjectData(): void {
    this.isLoading = true
    this.projectService
      .getProjectById(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.project = data
          this.processProjectData(data)
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar los datos del proyecto")
        },
      })
  }

  processProjectData(project: Project): void {
    // Store original data
    this.originalProject = project
    this.categoriesAvailable = project.categories || []

    // Extract and store original transactions
    this.extractOriginalTransactions(project.categories || [])

    // Store original data for other entities
    this.originalGoals = project.goals || []
    this.originalInvestments = project.investments || []
    this.originalMaturities = project.maturities || []
    this.originalReminders = project.reminders || []

    // Apply filters and update data (initially no filters)
    this.applyFiltersAndUpdateData()
  }

  private extractOriginalTransactions(categories: Category[]): void {
    this.originalTransactions = []
    categories.forEach((category: Category) => {
      if (category.transactions && category.transactions.length > 0) {
        category.transactions.forEach((transaction: Transaction) => {
          if (!transaction.isActive) {
            return
          }
          this.originalTransactions.push({
            ...transaction,
            category: {
              id: category.id,
              name: category.name,
              color: category.color,
            },
          } as Transaction)
        })
      }
    })
  }

  applyFilter(): void {
    this.applyFiltersAndUpdateData()
  }

  private applyFiltersAndUpdateData(): void {
    // Filter transactions
    const filteredTransactions = this.filterTransactionsByDateAndCategory()

    // Filter other entities by date only
    const filteredGoals = this.filterEntitiesByDate(this.originalGoals)
    const filteredInvestments = this.filterEntitiesByDate(this.originalInvestments)
    const filteredMaturities = this.filterEntitiesByDate(this.originalMaturities)
    const filteredReminders = this.filterEntitiesByDate(this.originalReminders)

    // Update component data with filtered results
    this.updateComponentDataWithFiltered(
      filteredTransactions,
      filteredGoals,
      filteredInvestments,
      filteredMaturities,
      filteredReminders,
    )

    // Recalculate summaries and update charts
    this.calculateFinancialSummaryFromFiltered(filteredTransactions)
    this.updateChartsFromFiltered()
  }

  private filterTransactionsByDateAndCategory(): Transaction[] {
    return this.originalTransactions.filter((transaction) => {
      // Date filter
      if (!this.passesDateFilter(transaction.createdDate)) {
        return false
      }

      // Category filter
      if (this.selectedCategory && transaction.category.id !== this.selectedCategory.id) {
        return false
      }

      return true
    })
  }

  private filterEntitiesByDate(entities: any[]): any[] {
    return entities.filter((entity) => this.passesDateFilter(entity.createdDate))
  }

  private passesDateFilter(createdDate: any): boolean {
    if (!createdDate) return true

    const entityDate = this.parseCreatedDate(createdDate)

    // Check date from filter
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      if (entityDate < fromDate) {
        return false
      }
    }

    // Check date to filter
    if (this.dateTo) {
      const toDate = new Date(this.dateTo)
      toDate.setHours(23, 59, 59, 999)
      if (entityDate > toDate) {
        return false
      }
    }

    return true
  }

  private parseCreatedDate(createdDate: any): Date {
    if (typeof createdDate === "string") {
      // Handle string format: "2025-05-27 00:20:09"
      return new Date(createdDate)
    } else if (Array.isArray(createdDate)) {
      // Handle array format: [2025,5,27,0,20,9,235391000]
      return new Date(
        createdDate[0],
        createdDate[1] - 1,
        createdDate[2],
        createdDate[3] || 0,
        createdDate[4] || 0,
        createdDate[5] || 0,
      )
    }
    return new Date()
  }

  private updateComponentDataWithFiltered(
    transactions: Transaction[],
    goals: Goal[],
    investments: Investment[],
    maturities: Maturity[],
    reminders: any[],
  ): void {
    // Update recent transactions (last 5)
    const sortedTransactions = transactions.sort((a, b) => {
      const dateA = this.parseCreatedDate(a.createdDate).getTime()
      const dateB = this.parseCreatedDate(b.createdDate).getTime()
      return dateB - dateA
    })

    this.recentTransactions = sortedTransactions.slice(0, 5).map((t: Transaction) => ({
      id: t.id,
      date: this.parseCreatedDate(t.createdDate),
      description: `Transaccion #${t.id}`,
      amount: t.quantity,
      category: t.category.name,
      categoryColor: t.category.color,
    }))

    // Process goals
    this.processGoals(goals)

    // Process investments
    this.processInvestments(investments)

    // Process maturities
    this.processMaturities(maturities)
  }

  private calculateFinancialSummaryFromFiltered(transactions: Transaction[]): void {
    // Reset totals
    this.totalIncome = 0
    this.totalExpenses = 0

    // Calculate from filtered transactions
    transactions.forEach((transaction) => {
      if (transaction.quantity > 0) {
        this.totalIncome += transaction.quantity
      } else {
        this.totalExpenses += Math.abs(transaction.quantity)
      }
    })

    // Calculate total balance and savings rate
    this.totalBalance = this.totalIncome - this.totalExpenses
    this.savingsRate =
      this.totalIncome > 0 ? Math.round(((this.totalIncome - this.totalExpenses) / this.totalIncome) * 100) : 0

    // Update categories with filtered data
    this.updateCategoriesFromFiltered(transactions)
  }

  private updateCategoriesFromFiltered(transactions: Transaction[]): void {
    // Calculate expenses by category
    const expensesByCategory = new Map<number, number>()
    const incomeByCategory = new Map<number, number>()

    transactions.forEach((transaction) => {
      const categoryId = transaction.category.id

      if (transaction.quantity < 0) {
        const current = expensesByCategory.get(categoryId) || 0
        expensesByCategory.set(categoryId, current + Math.abs(transaction.quantity))
      } else {
        const current = incomeByCategory.get(categoryId) || 0
        incomeByCategory.set(categoryId, current + transaction.quantity)
      }
    })

    // Update expense categories
    this.categories = this.categoriesAvailable
      .map((category) => {
        const amount = expensesByCategory.get(category.id) || 0
        const percentage = this.totalExpenses > 0 ? (amount / this.totalExpenses) * 100 : 0

        return {
          id: category.id,
          name: category.name,
          color: category.color,
          amount: amount,
          percentage: Math.round(percentage),
        }
      })
      .filter((c) => c.amount > 0)

    // Update income categories
    this.incomeCategories = this.categoriesAvailable
      .map((category) => {
        const amount = incomeByCategory.get(category.id) || 0
        const percentage = this.totalIncome > 0 ? (amount / this.totalIncome) * 100 : 0

        return {
          id: category.id,
          name: category.name,
          color: category.color,
          amount: amount,
          percentage: Math.round(percentage),
        }
      })
      .filter((c) => c.amount > 0)
  }

  private updateChartsFromFiltered(): void {
    this.updateExpensePieChart()
    this.updateIncomePieChart()
  }

  clearFilters(): void {
    this.dateFrom = null
    this.dateTo = null
    this.selectedCategory = null
    this.applyFiltersAndUpdateData()
  }

  processGoals(goals: Goal[]): void {
    this.goals = goals.map((goal) => {
      return {
        id: goal.id,
        objective: goal.objective || `Goal #${goal.id}`,
        endDate: this.parseCreatedDate(goal.endDate || goal.createdDate),
        targetAmount: goal.quantity || 0,
      }
    })
  }

  processInvestments(investments: Investment[]): void {
    this.investments = investments.map((investment) => {
      // Mock price and change data since API doesn't provide real-time data
      const price = 100 + Math.random() * 200
      const change = Math.random() * 10 - 5
      const changePercentage = (change / price) * 100
      const value = investment.quantity * price

      return {
        id: investment.id,
        tickerSymbol: investment.tickerSymbol || `INV${investment.id}`,
        name: (investment.tickerSymbol || `Investment ${investment.id}`) + " Inc.",
        quantity: investment.quantity || 0,
        price: price,
        value: value,
        change: change,
        changePercentage: changePercentage,
      }
    })

    // Calculate investment totals
    this.investmentTotal = this.investments.reduce((sum, inv) => sum + inv.value, 0)
    this.investmentChange = this.investments.reduce((sum, inv) => sum + inv.change * inv.quantity, 0)

    if (this.investmentTotal - this.investmentChange !== 0) {
      this.investmentChangePercentage = (this.investmentChange / (this.investmentTotal - this.investmentChange)) * 100
    } else {
      this.investmentChangePercentage = 0
    }
  }

  processMaturities(maturities: Maturity[]): void {
    this.upcomingMaturities = maturities.map((maturity) => {
      const endDate = this.parseCreatedDate(maturity.endDate || maturity.createdDate)
      const daysLeft = this.getDaysLeft(endDate)

      // Determine state based on date and maturity state
      let state: "PENDING" | "COMPLETED" | "OVERDUE" = "PENDING"
      if (maturity.state === "SOLVED") {
        state = "COMPLETED"
      } else if (maturity.state === "LATE") {
        state = "OVERDUE"
      } else if (daysLeft < 0) {
        state = "OVERDUE"
      }

      return {
        id: maturity.id,
        description: `Maturity #${maturity.id}`,
        amount: maturity.quantity || 0,
        endDate: endDate,
        daysLeft: Math.max(0, daysLeft),
        state: state,
      }
    })
  }

  updateExpensePieChart(): void {
    if (this.categories.length > 0) {
      this.expensePieChartData = {
        labels: this.categories.map((cat) => cat.name),
        datasets: [
          {
            data: this.categories.map((cat) => cat.amount),
            backgroundColor: this.categories.map((cat) => cat.color),
          },
        ],
      }
    } else {
      this.expensePieChartData = {
        labels: ["No hay datos"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e0e0e0"],
          },
        ],
      }
    }
  }

  updateIncomePieChart(): void {
    if (this.incomeCategories.length > 0) {
      this.incomePieChartData = {
        labels: this.incomeCategories.map((cat) => cat.name),
        datasets: [
          {
            data: this.incomeCategories.map((cat) => cat.amount),
            backgroundColor: this.incomeCategories.map((cat) => cat.color),
          },
        ],
      }
    } else {
      this.incomePieChartData = {
        labels: ["No hay datos"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e0e0e0"],
          },
        ],
      }
    }
  }

  getDaysLeft(date: Date): number {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "ARS" }).format(amount)
  }

  formatDate(date: Date | string | any[]): string {
    if (Array.isArray(date)) {
      return new Intl.DateTimeFormat("es-ES").format(new Date(date[0], date[1] - 1, date[2]))
    }
    return new Intl.DateTimeFormat("es-ES").format(new Date(date))
  }
}
