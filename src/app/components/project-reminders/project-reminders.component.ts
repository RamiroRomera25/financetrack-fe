import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
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
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { ReminderService } from "../../services/reminder.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import type { Reminder, ReminderDTOPost, ReminderDTOPut } from "../../models/reminder"
import { finalize } from "rxjs/operators"
import {TutorialService} from "../../services/tutorial.service";

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
    MatProgressSpinnerModule,
    ProjectSidebarComponent,
  ],
})
export class ProjectRemindersComponent implements OnInit {
  reminderForm: FormGroup
  reminders: Reminder[] = []
  filteredReminders: Reminder[] = []
  editMode = false
  currentReminderId: number | null = null
  upcomingCount = 0
  overdueCount = 0
  projectId = 0

  // Loading states
  isLoadingData = false
  isSubmitting = false
  isDeleting = false
  deletingReminderId: number | null = null

  private reminderService = inject(ReminderService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private route = inject(ActivatedRoute)

  constructor(
    private fb: FormBuilder,
  ) {
    this.reminderForm = this.fb.group({
      subject: ["", Validators.required],
      reminderDate: [new Date(), Validators.required],
    })

    this.filteredReminders = [...this.reminders]
    this.calculateSummary()
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get("p"))
    this.loadReminders()
  }

  loadReminders(): void {
    this.isLoadingData = true
    this.reminderService
      .getReminders(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoadingData = false
        }),
      )
      .subscribe({
        next: (data) => {
          this.reminders = data
          this.filteredReminders = [...this.reminders]
          this.filterReminders("upcoming")
          this.calculateSummary()
        },
        error: (error) => {
          this.snackBarService.sendError("Error al cargar los recordatorios")
        },
      })
  }

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
      this.isSubmitting = true
      const formValue = this.reminderForm.value

      if (this.editMode && this.currentReminderId !== null) {
        // Actualizar recordatorio existente
        const reminderPut: ReminderDTOPut = {
          subject: formValue.subject,
          reminderDate: formValue.reminderDate,
        }

        this.reminderService
          .updateReminder(this.projectId, this.currentReminderId, reminderPut)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (updatedReminder) => {
              const index = this.reminders.findIndex((reminder) => reminder.id === this.currentReminderId)
              if (index !== -1) {
                this.reminders[index] = {
                  ...this.reminders[index],
                  ...updatedReminder,
                }
                this.snackBarService.sendSuccess("Recordatorio actualizado correctamente")
              }
              this.filteredReminders = [...this.reminders]
              this.calculateSummary()
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al actualizar el recordatorio")
            },
          })
      } else {
        // Añadir nuevo recordatorio
        const reminderPost: ReminderDTOPost = {
          subject: formValue.subject,
          reminderDate: formValue.reminderDate,
          projectId: this.projectId,
        }

        this.reminderService
          .createReminder(reminderPost)
          .pipe(
            finalize(() => {
              this.isSubmitting = false
            }),
          )
          .subscribe({
            next: (newReminder) => {
              this.reminders.push(newReminder)
              this.snackBarService.sendSuccess("Recordatorio creado correctamente")
              this.filteredReminders = [...this.reminders]
              this.calculateSummary()
              this.resetForm()
            },
            error: (error) => {
              this.snackBarService.sendError("Error al crear el recordatorio")
            },
          })
      }
    }
  }

  editReminder(reminder: Reminder): void {
    this.editMode = true
    this.currentReminderId = reminder.id
    this.reminderForm.setValue({
      subject: reminder.subject,
      reminderDate: new Date(reminder.reminderDate),
    })
  }

  deleteReminder(id: number): void {
    this.modalService.confirmDelete("recordatorio").subscribe((confirmed) => {
      if (confirmed) {
        this.isDeleting = true
        this.deletingReminderId = id

        this.reminderService
          .deleteReminder(this.projectId, id)
          .pipe(
            finalize(() => {
              this.isDeleting = false
              this.deletingReminderId = null
            }),
          )
          .subscribe({
            next: () => {
              this.reminders = this.reminders.filter((reminder) => reminder.id !== id)
              this.filteredReminders = [...this.reminders]
              this.calculateSummary()
              this.snackBarService.sendSuccess("Recordatorio eliminado correctamente")

              if (this.currentReminderId === id) {
                this.resetForm()
              }
            },
            error: (error) => {
              this.snackBarService.sendError("Error al eliminar el recordatorio")
            },
          })
      }
    })
  }

  cancelEdit(): void {
    this.resetForm()
  }

  resetForm(): void {
    this.reminderForm.reset({
      subject: "",
      reminderDate: new Date(),
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
    this.sortReminders(this.dateCriteria);
  }
  minDate: Date = new Date()
  dateCriteria: string = "date-asc"
  sortReminders(criteria: string): void {
    this.dateCriteria = criteria
    this.filteredReminders.sort((a, b) => {
      if (criteria === "date-asc") {
        return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
      } else if (criteria === "date-desc") {
        return new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime()
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
