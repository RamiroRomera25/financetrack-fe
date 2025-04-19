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

interface MonthlyData {
  month: string
  income: number
  expenses: number
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
  ],
})
export class ProjectHomeComponent implements OnInit {
  // Project data
  project: Project | null = null
  projectId = 0
  isLoading = false

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

  // Goals
  goals: GoalDisplay[] = []

  // Investments
  investments: InvestmentDisplay[] = []
  investmentTotal = 0
  investmentChange = 0
  investmentChangePercentage = 0

  // Maturities
  upcomingMaturities: MaturityDisplay[] = []

  // Monthly data for charts
  monthlyData: MonthlyData[] = []

  // Income and Expense Pie Chart
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
            // Calcular el total de forma segura
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

  public pieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
  }

  public pieChartType: ChartType = "pie"

  public pieChartData: ChartData<"pie"> = {
    labels: ["Alimentos", "Transporte", "Vivienda", "Salud"],
    datasets: [
      {
        data: [50, 30, 15, 5],
        backgroundColor: ["#ff0000", "#ff9900", "#33cc33", "#3399ff"],
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
            // Calcular el total de forma segura
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
            // Calcular el total de forma segura
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

  // Add a new property for income categories
  incomeCategories: CategorySummary[] = []

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
    // Process categories and transactions
    this.processCategories(project.categories || [])

    // Process goals
    this.processGoals(project.goals || [])

    // Process investments
    this.processInvestments(project.investments || [])

    // Process maturities
    this.processMaturities(project.maturities || [])

    // Calculate financial summary
    this.calculateFinancialSummary()

    // Update charts
    this.updateCharts()
  }

  // Update the processCategories method to also process income categories
  processCategories(categories: Category[]): void {
    // Extract transactions from categories
    const allTransactions: Transaction[] = []
    let totalExpenses = 0
    let totalIncome = 0
    const incomeByCategory: Map<string, number> = new Map()

    categories.forEach((category: Category) => {
      if (category.transactions && category.transactions.length > 0) {
        category.transactions.forEach((transaction) => {
          allTransactions.push({
            ...transaction,
            category: {
              id: category.id,
              name: category.name,
              color: category.color,
            },
          } as Transaction)

          // Sum up expenses (negative quantities)
          if (transaction.quantity < 0) {
            totalExpenses += Math.abs(transaction.quantity)
          }
          // Sum up income (positive quantities)
          else if (transaction.quantity > 0) {
            totalIncome += transaction.quantity

            // Track income by category
            const currentAmount = incomeByCategory.get(category.name) || 0
            incomeByCategory.set(category.name, currentAmount + transaction.quantity)
          }
        })
      }
    })

    // Sort transactions by date (most recent first)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.createdDate || 0).getTime()
      const dateB = new Date(b.createdDate || 0).getTime()
      return dateB - dateA
    })

    // Take the 5 most recent transactions
    this.recentTransactions = allTransactions.slice(0, 5).map((t: Transaction) => ({
      id: t.id,
      date: new Date(t.createdDate || new Date()),
      description: `Transaction #${t.id}`,
      amount: t.quantity,
      category: t.category.name,
      categoryColor: t.category.color,
    }))

    // Calculate category summaries for expenses
    if (totalExpenses > 0) {
      this.categories = categories
        .map((category) => {
          const categoryExpenses = this.calculateCategoryExpenses(category)
          const percentage = totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0

          return {
            id: category.id,
            name: category.name,
            color: category.color,
            amount: categoryExpenses,
            percentage: Math.round(percentage),
          }
        })
        .filter((c) => c.amount > 0)
    } else {
      // If no expenses, create empty category summaries
      this.categories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        amount: 0,
        percentage: 0,
      }))
    }

    // Calculate category summaries for income
    if (totalIncome > 0) {
      this.incomeCategories = categories
        .map((category) => {
          const categoryIncome = incomeByCategory.get(category.name) || 0
          const percentage = totalIncome > 0 ? (categoryIncome / totalIncome) * 100 : 0

          return {
            id: category.id,
            name: category.name,
            color: category.color,
            amount: categoryIncome,
            percentage: Math.round(percentage),
          }
        })
        .filter((c) => c.amount > 0)
    } else {
      // If no income, create empty category summaries
      this.incomeCategories = []
    }

    // Update total income and expenses
    this.totalIncome = totalIncome
    this.totalExpenses = totalExpenses
  }

  // Helper method to safely calculate category expenses
  calculateCategoryExpenses(category: Category): number {
    if (!category.transactions || category.transactions.length === 0) {
      return 0
    }

    let total = 0
    for (const transaction of category.transactions) {
      if (transaction.quantity < 0) {
        total += Math.abs(transaction.quantity)
      }
    }
    return total
  }

  processGoals(goals: Goal[]): void {
    this.goals = goals.map((goal) => {
      return {
        id: goal.id,
        objective: goal.objective,
        endDate: new Date(goal.endDate),
        targetAmount: goal.quantity,
      }
    })
  }

  processInvestments(investments: Investment[]): void {
    // For simplicity, we'll use mock data for some investment details
    // In a real app, you would get this data from the API
    this.investments = investments.map((investment) => {
      // Mock price and change data
      const price = 100 + Math.random() * 200
      const change = Math.random() * 10 - 5
      const changePercentage = (change / price) * 100
      const value = investment.quantity * price

      return {
        id: investment.id,
        tickerSymbol: investment.tickerSymbol,
        name: investment.tickerSymbol + " Inc.", // Mock company name
        quantity: investment.quantity,
        price: price,
        value: value,
        change: change,
        changePercentage: changePercentage,
      }
    })

    // Calculate investment totals
    this.investmentTotal = this.investments.reduce((sum, inv) => sum + inv.value, 0)
    this.investmentChange = this.investments.reduce((sum, inv) => sum + inv.change * inv.quantity, 0)

    // Avoid division by zero
    if (this.investmentTotal - this.investmentChange !== 0) {
      this.investmentChangePercentage = (this.investmentChange / (this.investmentTotal - this.investmentChange)) * 100
    } else {
      this.investmentChangePercentage = 0
    }
  }

  processMaturities(maturities: Maturity[]): void {
    this.upcomingMaturities = maturities.map((maturity) => {
      const endDate = new Date(maturity.endDate)
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
        description: `Maturity #${maturity.id}`, // Mock description
        amount: maturity.quantity,
        endDate: endDate,
        daysLeft: Math.max(0, daysLeft),
        state: state,
      }
    })
  }

  calculateFinancialSummary(): void {
    // Calculate total balance
    this.totalBalance = this.totalIncome - this.totalExpenses

    // Calculate savings rate
    this.savingsRate =
      this.totalIncome > 0 ? Math.round(((this.totalIncome - this.totalExpenses) / this.totalIncome) * 100) : 0
  }

  updateCharts(): void {
    // Actualizar gráfico de distribución de gastos
    this.updateExpensePieChart()

    // Actualizar gráfico de distribución de ingresos
    this.updateIncomePieChart()
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
      // Si no hay categorías, mostrar un gráfico vacío
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
      // Si no hay categorías de ingresos, mostrar un gráfico vacío
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
    // Handle array format from API
    if (Array.isArray(date)) {
      // Format: [year, month, day]
      return new Intl.DateTimeFormat("es-ES").format(new Date(date[0], date[1] - 1, date[2]))
    }
    return new Intl.DateTimeFormat("es-ES").format(new Date(date))
  }
}
