import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTableModule } from "@angular/material/table"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatDividerModule } from "@angular/material/divider"
import type { ChartConfiguration, ChartData, ChartType } from "chart.js"
import {BaseChartDirective} from "ng2-charts";
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

interface Transaction {
    id: number
    date: Date
    description: string
    amount: number
    category: string
    categoryColor: string
}

interface Category {
    id: number
    name: string
    color: string
    amount: number
    percentage: number
}

interface Goal {
    id: number
    objective: string
    endDate: Date
    targetAmount: number
    currentAmount: number
    progress: number
}

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

interface Maturity {
    id: number
    description: string
    amount: number
    endDate: Date
    daysLeft: number
    state: "PENDING" | "COMPLETED" | "OVERDUE"
}

@Component({
    selector: 'app-project-home',
    standalone: true,
    templateUrl: './project-home.component.html',
    styleUrl: './project-home.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDividerModule,
    BaseChartDirective,
    ProjectSidebarComponent,
  ]
})
export class ProjectHomeComponent implements OnInit {
    // Financial summary
    totalBalance = 24500
    totalIncome = 8750
    totalExpenses = 3250
    savingsRate = 62.9

    // Transactions
    recentTransactions: Transaction[] = []
    displayedColumns: string[] = ["date", "description", "category", "amount"]

    // Categories
    categories: Category[] = []

    // Goals
    goals: Goal[] = []

    // Investments
    investments: Investment[] = []
    investmentTotal = 0
    investmentChange = 0
    investmentChangePercentage = 0

    // Maturities
    upcomingMaturities: Maturity[] = []

    // Charts
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
        },
        beginAtZero: true,
      },
    },
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        data: [1500, 2500, 1200, 1800, 2200],
        label: 'Ingresos',
        backgroundColor: '#4caf50',
      },
      {
        data: [1000, 1500, 800, 1200, 1300],
        label: 'Gastos',
        backgroundColor: '#f44336',
      },
    ],
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartData<'pie'> = {
    labels: ['Alimentos', 'Transporte', 'Vivienda', 'Salud'],
    datasets: [
      {
        data: [50, 30, 15, 5],
        backgroundColor: ['#ff0000', '#ff9900', '#33cc33', '#3399ff'],
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Balance',
        },
        beginAtZero: true,
      },
    },
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: {
    datasets: { borderColor: string; data: number[]; label: string; fill: boolean }[];
    labels: string[]
  } = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        data: [10000, 12000, 11500, 13000, 14000],
        label: 'Balance Total',
        borderColor: '#2196f3',
        fill: false,
      },
    ],
  };

    ngOnInit(): void {
        this.generateMockData()
        this.updateCharts()
    }

    generateMockData(): void {
        // Generate categories
        this.categories = [
            { id: 1, name: "Alimentación", color: "#FF5722", amount: 850, percentage: 26.2 },
            { id: 2, name: "Transporte", color: "#2196F3", amount: 450, percentage: 13.8 },
            { id: 3, name: "Vivienda", color: "#4CAF50", amount: 1200, percentage: 36.9 },
            { id: 4, name: "Entretenimiento", color: "#9C27B0", amount: 350, percentage: 10.8 },
            { id: 5, name: "Salud", color: "#F44336", amount: 200, percentage: 6.2 },
            { id: 6, name: "Otros", color: "#607D8B", amount: 200, percentage: 6.2 },
        ]

        // Generate transactions
        this.recentTransactions = [
            {
                id: 1,
                date: new Date(2025, 3, 15),
                description: "Supermercado El Corte",
                amount: -120,
                category: "Alimentación",
                categoryColor: "#FF5722",
            },
            {
                id: 2,
                date: new Date(2025, 3, 14),
                description: "Transferencia recibida",
                amount: 2500,
                category: "Ingresos",
                categoryColor: "#0a7c43",
            },
            {
                id: 3,
                date: new Date(2025, 3, 12),
                description: "Pago de alquiler",
                amount: -800,
                category: "Vivienda",
                categoryColor: "#4CAF50",
            },
            {
                id: 4,
                date: new Date(2025, 3, 10),
                description: "Cine y restaurante",
                amount: -85,
                category: "Entretenimiento",
                categoryColor: "#9C27B0",
            },
            {
                id: 5,
                date: new Date(2025, 3, 8),
                description: "Gasolina",
                amount: -60,
                category: "Transporte",
                categoryColor: "#2196F3",
            },
        ]

        // Generate goals
        this.goals = [
            {
                id: 1,
                objective: "Fondo de emergencia",
                endDate: new Date(2025, 8, 30),
                targetAmount: 10000,
                currentAmount: 6500,
                progress: 65,
            },
            {
                id: 2,
                objective: "Vacaciones",
                endDate: new Date(2025, 5, 15),
                targetAmount: 3000,
                currentAmount: 2100,
                progress: 70,
            },
            {
                id: 3,
                objective: "Nuevo ordenador",
                endDate: new Date(2025, 4, 20),
                targetAmount: 1500,
                currentAmount: 1200,
                progress: 80,
            },
        ]

        // Generate investments
        this.investments = [
            {
                id: 1,
                tickerSymbol: "AAPL",
                name: "Apple Inc.",
                quantity: 10,
                price: 185.92,
                value: 1859.2,
                change: 3.45,
                changePercentage: 1.89,
            },
            {
                id: 2,
                tickerSymbol: "MSFT",
                name: "Microsoft Corp.",
                quantity: 8,
                price: 417.88,
                value: 3343.04,
                change: 2.12,
                changePercentage: 0.51,
            },
            {
                id: 3,
                tickerSymbol: "AMZN",
                name: "Amazon.com Inc.",
                quantity: 5,
                price: 182.41,
                value: 912.05,
                change: -1.23,
                changePercentage: -0.67,
            },
            {
                id: 4,
                tickerSymbol: "GOOGL",
                name: "Alphabet Inc.",
                quantity: 6,
                price: 174.13,
                value: 1044.78,
                change: 0.87,
                changePercentage: 0.5,
            },
        ]

        // Calculate investment totals
        this.investmentTotal = this.investments.reduce((sum, inv) => sum + inv.value, 0)
        this.investmentChange = this.investments.reduce((sum, inv) => sum + inv.change * inv.quantity, 0)
        this.investmentChangePercentage = (this.investmentChange / (this.investmentTotal - this.investmentChange)) * 100

        // Generate maturities
        this.upcomingMaturities = [
            {
                id: 1,
                description: "Pago de hipoteca",
                amount: 950,
                endDate: new Date(2025, 3, 30),
                daysLeft: 15,
                state: "PENDING",
            },
            {
                id: 2,
                description: "Seguro de coche",
                amount: 320,
                endDate: new Date(2025, 4, 5),
                daysLeft: 20,
                state: "PENDING",
            },
            {
                id: 3,
                description: "Depósito a plazo fijo",
                amount: 5000,
                endDate: new Date(2025, 5, 15),
                daysLeft: 60,
                state: "PENDING",
            },
        ]
    }

    updateCharts(): void {
        // Update pie chart with categories
        this.pieChartData = {
            labels: this.categories.map((cat) => cat.name),
            datasets: [
                {
                    data: this.categories.map((cat) => cat.amount),
                    backgroundColor: this.categories.map((cat) => cat.color),
                },
            ],
        }
    }

    getDaysLeft(date: Date): number {
        const today = new Date()
        const diffTime = date.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat("es-ES").format(date)
    }
}
