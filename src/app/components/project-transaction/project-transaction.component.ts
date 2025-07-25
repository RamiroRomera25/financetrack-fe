import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatDividerModule } from "@angular/material/divider"
import { MatTableModule } from "@angular/material/table"
import { MatSortModule } from "@angular/material/sort"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatChipsModule } from "@angular/material/chips"
import { MatRadioModule } from "@angular/material/radio"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { ActivatedRoute } from "@angular/router"
import { TransactionService } from "../../services/transaction.service"
import { CategoryService } from "../../services/category.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import type { Transaction, TransactionDTOPost, TransactionDTOPut } from "../../models/transaction"
import type { Category } from "../../models/category"
import { finalize } from "rxjs/operators"
import {TutorialService} from "../../services/tutorial.service";

@Component({
  selector: "app-project-transaction",
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectSidebarComponent,
  ],
  templateUrl: "./project-transaction.component.html",
  styleUrl: "./project-transaction.component.css",
})
export class ProjectTransactionComponent implements OnInit {
  transactionForm: FormGroup
  transactions: Transaction[] = []
  transactionFilter: Transaction[] = []
  categories: Category[] = []
  displayedColumns: string[] = ["date", "category", "quantity", "actions"]
  projectId = 0
  typeTransaction = false

  // Loading states
  isLoadingData = false
  isLoadingCategories = false
  isSubmitting = false
  isDeleting = false
  deletingTransactionId: number | null = null

  editMode = false
  currentTransactionId: number | null = null

  // Filter options
  filterType: "all" | "income" | "expense" = "all"
  filterCategory: number | null = null
  filterDateFrom = ""
  filterDateTo = ""
  filterDateFromDate: Date | null = null
  filterDateToDate: Date | null = null
  filterAmountFrom: number | null = null
  filterAmountTo: number | null = null
  maxDate: string = new Date().toISOString().split("T")[0]
  maxDateObj: Date = new Date()

  private route = inject(ActivatedRoute)
  private transactionService = inject(TransactionService)
  private categoryService = inject(CategoryService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private tutorialService = inject(TutorialService)

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadCategories()
    this.loadTransactions()
    const today = new Date();
    this.filterDateFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filterDateToDate = today;
  }

  // ngAfterViewInit() {
  //   this.tutorialService.startTransactionTutorial();
  // }

  loadCategories(): void {
    this.isLoadingCategories = true
    this.categoryService
      .getCategories(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoadingCategories = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.categories = data
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar las categorías")
        },
      })
  }

  loadTransactions(): void {
    this.isLoadingData = true
    this.transactionService
      .getTransactions(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoadingData = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.transactions = data
          this.transactionFilter = data
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar las transacciones")
        },
      })
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isSubmitting = true
      const formValue = this.transactionForm.value

      if (this.editMode && this.currentTransactionId !== null) {
        // Update existing transaction
        const transactionPut: TransactionDTOPut = {
          quantity: this.typeTransaction ? formValue.quantity : formValue.quantity * -1,
          categoryId: formValue.categoryId,
        }

        this.transactionService
          .updateTransaction(this.projectId, this.currentTransactionId, transactionPut)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (updatedTransaction) => {
              const index = this.transactions.findIndex((t) => t.id === this.currentTransactionId)
              this.snackBarService.sendSuccess("Transacción actualizada correctamente")
              this.resetForm()
              this.loadTransactions()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al actualizar la transacción")
            },
          })
      } else {
        // Create new transaction
        const transactionPost: TransactionDTOPost = {
          quantity: this.typeTransaction ? formValue.quantity : formValue.quantity * -1,
          categoryId: formValue.categoryId,
          projectId: this.projectId,
        }

        this.transactionService
          .createTransaction(transactionPost)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (newTransaction) => {
              this.transactions.unshift(newTransaction)
              this.snackBarService.sendSuccess("Transacción creada correctamente")
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al crear la transacción")
              this.resetForm()
            },
          })
      }
    }
  }

  resetForm(): void {
    this.transactionForm.reset({
      quantity: null,
      categoryId: null
    })
    this.editMode = false
    this.currentTransactionId = null
    this.typeTransaction = false
    this.markFormGroupUntouched(this.transactionForm)
  }

  deleteTransaction(id: number): void {
    this.modalService.confirmDelete("transacción").subscribe((confirmed) => {
      if (confirmed) {
        this.isDeleting = true
        this.deletingTransactionId = id

        this.transactionService
          .deleteTransaction(this.projectId, id)
          .pipe(
            finalize(() => {
              this.isDeleting = false
              this.deletingTransactionId = null
            }),
          )
          .subscribe({
            next: () => {
              this.transactions = this.transactions.filter((t) => t.id !== id)
              this.snackBarService.sendSuccess("Transacción eliminada correctamente")
            },
            error: (error) => {
              this.snackBarService.sendError("Error al eliminar la transacción")
            },
          })
      }
    })
  }

  editTransaction(transaction: Transaction): void {
    this.editMode = true
    this.currentTransactionId = transaction.id
    this.typeTransaction = transaction.quantity > 0

    this.transactionForm.setValue({
      quantity: Math.abs(transaction.quantity),
      categoryId: transaction.category.id,
    })
  }

  formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("es-ES").format(new Date(date))
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "ARS" }).format(amount)
  }

  getFilteredTransactions(): Transaction[] {
    this.transactions.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    let filtered = this.transactions.filter((transaction) => {
      // Filter by category
      if (this.filterCategory !== null && transaction.category.id !== this.filterCategory) {
        return false
      }

      // Filter by date range using Date objects
      if (this.filterDateFromDate) {
        const transactionDate = new Date(transaction.createdDate)
        transactionDate.setHours(0, 0, 0, 0)
        const filterDate = new Date(this.filterDateFromDate)
        filterDate.setHours(0, 0, 0, 0)
        if (transactionDate < filterDate) {
          return false
        }
      }

      if (this.filterDateToDate) {
        const transactionDate = new Date(transaction.createdDate)
        transactionDate.setHours(23, 59, 59, 999)
        const filterDate = new Date(this.filterDateToDate)
        filterDate.setHours(23, 59, 59, 999)
        if (transactionDate > filterDate) {
          return false
        }
      }

      // Filter by amount range
      if (this.filterAmountFrom !== null && Math.abs(transaction.quantity) < this.filterAmountFrom) {
        return false
      }

      if (this.filterAmountTo !== null && Math.abs(transaction.quantity) > this.filterAmountTo) {
        return false
      }

      return true
    })
    this.transactionFilter = filtered;
    this.getTotalIncome();
    this.getTotalExpenses();
    this.getTotalBalance();
    return filtered;
  }

  clearFilters(): void {
    this.filterType = "all"
    this.filterCategory = null
    this.filterDateFrom = ""
    this.filterDateTo = ""
    this.filterDateFromDate = null
    this.filterDateToDate = null
    this.filterAmountFrom = null
    this.filterAmountTo = null
  }

  getTotalBalance(): number {
    return this.transactionFilter.reduce((total, transaction) => {
      return total + transaction.quantity
    }, 0)
  }

  markFormGroupUntouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsUntouched()

      if ((control as any).controls) {
        this.markFormGroupUntouched(control as FormGroup)
      }
    })
  }

  getTotalIncome(): number {
    return this.transactionFilter
      .filter((t) => t.quantity >= 0)
      .reduce((total, transaction) => total + transaction.quantity, 0)
  }

  getTotalExpenses(): number {
    return this.transactionFilter
      .filter((t) => t.quantity < 0)
      .reduce((total, transaction) => total + transaction.quantity, 0)
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find((c) => c.id === id)
  }

  typeTransactionChange(b: boolean) {
    this.typeTransaction = b
  }
}
