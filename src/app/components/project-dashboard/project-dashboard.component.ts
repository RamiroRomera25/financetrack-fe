import { Component, inject, type AfterViewInit } from "@angular/core"
import { animate, style, transition, trigger } from "@angular/animations"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { Project } from "../../models/project"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { Router } from "@angular/router"
import { ProjectFormModalComponent } from "./project-form-modal/project-form-modal.component"
import { ProjectService } from "../../services/project.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { ModalService } from "../../services/modal.service"
import { TutorialService } from "../../services/tutorial.service"
import { AuthService } from "../../services/auth.service"
import { finalize } from "rxjs/operators"
import { PremiumGuardService } from "../../services/premium-guard.service"

@Component({
  selector: "app-project-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ProjectSidebarComponent,
  ],
  templateUrl: "./project-dashboard.component.html",
  styleUrl: "./project-dashboard.component.css",
  animations: [
    trigger("cardAnimation", [
      transition("void => *", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate("300ms ease-in", style({ opacity: 1, transform: "scale(1)" })),
      ]),
      transition("* => void", [animate("300ms ease-out", style({ opacity: 0, transform: "scale(0.8)" }))]),
    ]),
  ],
})
export class ProjectDashboardComponent implements AfterViewInit {
  private router = inject(Router)
  private projectService = inject(ProjectService)
  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private dialog = inject(MatDialog)
  private premiumGuardService = inject(PremiumGuardService)
  private tutorialService = inject(TutorialService)
  private authService = inject(AuthService)

  projects: Project[] = []
  currentIndex = 0

  // Loading states
  isLoadingProjects = false
  isDeleting = false
  isNavigating = false

  // Button-specific loading states
  loadingProjectId: number | null = null

  get currentProject(): Project {
    return this.projects[this.currentIndex]
  }

  ngOnInit() {
    this.loadProjects()
  }

  ngAfterViewInit() {
    // Verificar si debe mostrar el tutorial después de que la vista se haya inicializado
    setTimeout(() => {
      this.checkAndStartTutorial()
    }, 1000) // Esperar un poco para que todo se cargue
  }

  private checkAndStartTutorial() {
    // Obtener información del usuario desde el servicio de auth
    const user = this.authService.getCurrentUser().subscribe((user) => {
      // Solo mostrar tutorial si NO es el primer login y no se ha completado antes
      // if (user && !user.firstLogin && this.tutorialService.shouldShowDashboardTutorial()) {
        this.tutorialService.startDashboardTutorial()
      // }
    })
  }

  loadProjects() {
    this.isLoadingProjects = true
    this.projectService
      .getUserProjects()
      .pipe(
        finalize(() => {
          this.isLoadingProjects = false
        }),
      )
      .subscribe({
        next: (projects: Project[]) => {
          if (projects.length == 0) {
            this.projects = []
          } else {
            this.projects = projects
          }
        },
        error: (error: any) => {
          this.snackBarService.sendError("Error al obtener los proyectos")
        },
      })
  }

  nextProject(): void {
    if (this.currentIndex < this.projects.length - 1) {
      this.currentIndex++
    } else {
      this.currentIndex = 0 // Volvemos al inicio si estamos en el último
    }
  }

  previousProject(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--
    } else {
      this.currentIndex = this.projects.length - 1 // Vamos al último si estamos en el primero
    }
  }

  selectProject(index: number): void {
    this.currentIndex = index
  }

  goToProjectHome() {
    if (this.isNavigating) return

    this.isNavigating = true
    this.loadingProjectId = this.currentProject.id

    // Simulate navigation delay
    setTimeout(() => {
      this.isNavigating = false
      this.loadingProjectId = null
      this.router.navigate([`/project/home/${this.currentProject.id}`])
    }, 800)
  }

  addNewProject(): void {
    if (this.projects.length >= 3) {
      this.premiumGuardService.checkUsageLimit("proyectos ilimitados", this.projects.length, 3).subscribe({
        next: (premiumAccess) => {
          if (premiumAccess) {
            this.executeAddNewProject()
          }
          return
        },
      })
    } else {
      this.executeAddNewProject()
    }
  }

  executeAddNewProject() {
    const dialogRef = this.dialog.open(ProjectFormModalComponent, {
      width: "400px",
      panelClass: "custom-dialog-container",
      disableClose: true,
      data: {}, // Sin proyecto para crear uno nuevo
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newProject: Partial<Project> = {
          name: result.name,
        }

        this.projectService.createProject(newProject).subscribe({
          next: (projectSaved: Project) => {
            this.projects.push(projectSaved)
            this.currentIndex = this.projects.length - 1
            this.snackBarService.sendSuccess("Proyecto creado correctamente")
          },
          error: (error: any) => {
            this.snackBarService.sendError("Error al crear el proyecto")
          },
        })
      }
    })
  }

  editProject(): void {
    const dialogRef = this.dialog.open(ProjectFormModalComponent, {
      width: "400px",
      panelClass: "custom-dialog-container",
      disableClose: true,
      data: { project: this.currentProject }, // Pasamos el proyecto actual para editar
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedProject: Partial<Project> = {
          name: result.name,
        }

        this.projectService.updateProject(result.id, updatedProject).subscribe({
          next: (projectUpdated: Project) => {
            // Actualizamos el proyecto en el array
            const index = this.projects.findIndex((p) => p.id === projectUpdated.id)
            if (index !== -1) {
              this.projects[index] = projectUpdated
            }
            this.snackBarService.sendSuccess("Proyecto actualizado correctamente")
          },
          error: (error: any) => {
            this.snackBarService.sendError("Error al actualizar el proyecto")
          },
        })
      }
    })
  }

  deleteProject(): void {
    this.modalService.confirmDelete("proyecto").subscribe((confirmed) => {
      if (confirmed) {
        this.performDelete()
      }
    })
  }

  performDelete(): void {
    this.isDeleting = true
    this.loadingProjectId = this.currentProject.id

    this.projectService
      .deleteProject(this.currentProject.id)
      .pipe(
        finalize(() => {
          this.isDeleting = false
          this.loadingProjectId = null
        }),
      )
      .subscribe({
        next: () => {
          this.projects.splice(this.currentIndex, 1)
          if (this.projects.length === 0) {
            this.currentIndex = 0
          } else if (this.currentIndex >= this.projects.length) {
            this.currentIndex = this.projects.length - 1
          }
          this.snackBarService.sendSuccess("Proyecto eliminado correctamente")
        },
        error: (error) => {
          this.snackBarService.sendError("Error al eliminar el proyecto")
        },
      })
  }
}
