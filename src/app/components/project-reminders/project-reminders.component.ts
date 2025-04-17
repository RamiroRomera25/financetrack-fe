import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatMenuModule } from "@angular/material/menu"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

interface ReminderEntity {
  id: number
  reminderDate: Date
  subject: string
  description?: string
  isRecurring?: boolean
  frequency?: string
  endDate?: Date
  priority: string
}

@Component({
  selector: "app-project-reminders",
  templateUrl: "./project-reminders.component.html",
  styleUrls: ["./project-reminders.component.css"],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSnackBarModule,
    ProjectSidebarComponent,
  ],
})
export class ProjectRemindersComponent implements OnInit {
  reminderForm: FormGroup
  reminders: ReminderEntity[] = []
  filteredReminders: ReminderEntity[] = []
  editMode = false
  currentReminderId: number | null = null
  upcomingCount = 0
  overdueCount = 0

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.reminderForm = this.fb.group({
      subject: ["", Validators.required],
      reminderDate: [new Date(), Validators.required],
      description: [""],
      isRecurring: [false],
      frequency: ["monthly"],
      endDate: [null],
      priority: ["medium"],
    })

    // Datos de ejemplo para mostrar en el mock-up
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    this.reminders = [
      {
        id: 1,
        subject: "Pago de hipoteca",
        reminderDate: tomorrow,
        description: "Pago mensual de la hipoteca de la casa",
        isRecurring: true,
        frequency: "monthly",
        endDate: new Date(today.getFullYear() + 5, today.getMonth(), today.getDate()),
        priority: "high",
      },
      {
        id: 2,
        subject: "Revisión de inversiones",
        reminderDate: nextWeek,
        description: "Revisar el rendimiento de las inversiones y ajustar la cartera si es necesario",
        isRecurring: true,
        frequency: "quarterly",
        priority: "medium",
      },
      {
        id: 3,
        subject: "Pago de seguro de auto",
        reminderDate: lastWeek,
        priority: "high",
      },
      {
        id: 4,
        subject: "Renovación de suscripción",
        reminderDate: today,
        description: "Renovar suscripción anual de servicios financieros",
        priority: "low",
      },
    ]

    this.filteredReminders = [...this.reminders]
    this.calculateSummary()
  }

  ngOnInit(): void {}

  calculateSummary(): void {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    this.upcomingCount = this.reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminderDate)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate > today && reminderDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    }).length

    this.overdueCount = this.reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminderDate)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate < today
    }).length
  }

  onSubmit(): void {
    if (this.reminderForm.valid) {
      const formValue = this.reminderForm.value

      if (this.editMode && this.currentReminderId !== null) {
        // Actualizar recordatorio existente
        const index = this.reminders.findIndex((reminder) => reminder.id === this.currentReminderId)

        if (index !== -1) {
          this.reminders[index] = {
            ...formValue,
            id: this.currentReminderId,
          }
          this.snackBar.open("Recordatorio actualizado correctamente", "Cerrar", { duration: 3000 })
        }
      } else {
        // Añadir nuevo recordatorio
        const newId = this.reminders.length > 0 ? Math.max(...this.reminders.map((reminder) => reminder.id)) + 1 : 1
        this.reminders.push({
          ...formValue,
          id: newId,
        })
        this.snackBar.open("Recordatorio creado correctamente", "Cerrar", { duration: 3000 })
      }

      this.filteredReminders = [...this.reminders]
      this.calculateSummary()
      this.resetForm()
    }
  }

  editReminder(reminder: ReminderEntity): void {
    this.editMode = true
    this.currentReminderId = reminder.id
    this.reminderForm.setValue({
      subject: reminder.subject,
      reminderDate: new Date(reminder.reminderDate),
      description: reminder.description || "",
      isRecurring: reminder.isRecurring || false,
      frequency: reminder.frequency || "monthly",
      endDate: reminder.endDate ? new Date(reminder.endDate) : null,
      priority: reminder.priority,
    })
  }

  deleteReminder(id: number): void {
    this.reminders = this.reminders.filter((reminder) => reminder.id !== id)
    this.filteredReminders = [...this.reminders]
    this.calculateSummary()
    this.snackBar.open("Recordatorio eliminado correctamente", "Cerrar", { duration: 3000 })

    if (this.currentReminderId === id) {
      this.resetForm()
    }
  }

  cancelEdit(): void {
    this.resetForm()
  }

  resetForm(): void {
    this.reminderForm.reset({
      subject: "",
      reminderDate: new Date(),
      description: "",
      isRecurring: false,
      frequency: "monthly",
      endDate: null,
      priority: "medium",
    })
    this.editMode = false
    this.currentReminderId = null
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredReminders = this.reminders.filter((reminder) => reminder.subject.toLowerCase().includes(filterValue))
  }

  filterReminders(filter: string): void {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (filter === "all") {
      this.filteredReminders = [...this.reminders]
    } else if (filter === "upcoming") {
      this.filteredReminders = this.reminders.filter((reminder) => {
        const reminderDate = new Date(reminder.reminderDate)
        reminderDate.setHours(0, 0, 0, 0)
        return reminderDate > today && reminderDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      })
    } else if (filter === "today") {
      this.filteredReminders = this.reminders.filter((reminder) => {
        const reminderDate = new Date(reminder.reminderDate)
        reminderDate.setHours(0, 0, 0, 0)
        return reminderDate.getTime() === today.getTime()
      })
    } else if (filter === "overdue") {
      this.filteredReminders = this.reminders.filter((reminder) => {
        const reminderDate = new Date(reminder.reminderDate)
        reminderDate.setHours(0, 0, 0, 0)
        return reminderDate < today
      })
    }
  }

  sortReminders(criteria: string): void {
    this.filteredReminders = [...this.reminders].sort((a, b) => {
      if (criteria === "date") {
        return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
      } else if (criteria === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        )
      }
      return 0
    })
  }

  getReminderStatusClass(reminderDate: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reminderDay = new Date(reminderDate)
    reminderDay.setHours(0, 0, 0, 0)

    if (reminderDay < today) {
      return "overdue"
    } else if (reminderDay.getTime() === today.getTime()) {
      return "today"
    } else if (reminderDay <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return "upcoming"
    }
    return ""
  }

  getReminderDateIcon(reminderDate: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reminderDay = new Date(reminderDate)
    reminderDay.setHours(0, 0, 0, 0)

    if (reminderDay < today) {
      return "event_busy"
    } else if (reminderDay.getTime() === today.getTime()) {
      return "today"
    } else {
      return "event"
    }
  }

  getTimeRemainingClass(reminderDate: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reminderDay = new Date(reminderDate)
    reminderDay.setHours(0, 0, 0, 0)
    const diffTime = reminderDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "overdue"
    } else if (diffDays <= 3) {
      return "warning"
    } else {
      return "on-time"
    }
  }

  getTimeRemainingIcon(reminderDate: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reminderDay = new Date(reminderDate)
    reminderDay.setHours(0, 0, 0, 0)
    const diffTime = reminderDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return "error"
    } else if (diffDays <= 3) {
      return "warning"
    } else {
      return "check_circle"
    }
  }

  getTimeRemainingText(reminderDate: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reminderDay = new Date(reminderDate)
    reminderDay.setHours(0, 0, 0, 0)
    const diffTime = reminderDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Vencido hace ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "día" : "días"}`
    } else if (diffDays === 0) {
      return "Hoy"
    } else if (diffDays === 1) {
      return "Mañana"
    } else {
      return `En ${diffDays} días`
    }
  }
}
