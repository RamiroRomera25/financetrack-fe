import {Component, inject} from "@angular/core"
import {animate, style, transition, trigger} from "@angular/animations"
import {CommonModule} from "@angular/common"
import {MatCardModule} from "@angular/material/card"
import {MatButtonModule} from "@angular/material/button"
import {MatIconModule} from "@angular/material/icon"
import {MatDialog, MatDialogModule} from "@angular/material/dialog"
import {MatSnackBarModule} from "@angular/material/snack-bar"
import type {Project} from "../../models/project"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component"
import {Router} from "@angular/router"
import {ProjectFormModalComponent} from "./project-form-modal/project-form-modal.component"
import {ProjectService} from "../../services/project.service"
import {SnackBarService} from "../../services/snack-bar.service"
import {ModalService} from "../../services/modal.service"

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
export class ProjectDashboardComponent {
  private router = inject(Router)

  private projectService = inject(ProjectService)

  private snackBarService = inject(SnackBarService)
  private modalService = inject(ModalService)
  private dialog = inject(MatDialog)

  projects: Project[] = []

  currentIndex = 0

  get currentProject(): Project {
    return this.projects[this.currentIndex]
  }

  ngOnInit() {
    this.projectService.getUserProjects().subscribe({
      next: (projects: Project[]) => {
        console.log(projects.length)
        if (projects.length == 0) {
          this.projects = []
          console.log("No projects available")
        } else {
          this.projects = projects
        }
      },
      error: (error: any) => {
        this.snackBarService.sendError("Error al obtener los proyectos")
        // this.ngOnInit();
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
    this.router.navigate([`/project/home/${this.currentProject.id}`])
  }

  addNewProject(): void {
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
    this.projectService.deleteProject(this.currentProject.id).subscribe({
      next: () => {
        this.projects.splice(this.currentIndex, 1)
        this.nextProject()
        this.snackBarService.sendSuccess("Proyecto eliminado correctamente")
      },
    })
  }
}
