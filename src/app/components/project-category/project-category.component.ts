import { Component, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatDividerModule } from "@angular/material/divider"
import { MatListModule } from "@angular/material/list"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDialogModule } from "@angular/material/dialog"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ProjectSidebarComponent } from "../project-sidebar/project-sidebar.component"
import { ActivatedRoute } from "@angular/router"
import { CategoryService } from "../../services/category.service"
import { Category, CategoryDTOPost, CategoryDTOPut } from "../../models/category"
import { ModalService } from "../../services/modal.service"
import { SnackBarService } from "../../services/snack-bar.service"
import { finalize } from "rxjs/operators"
import { ProjectService } from "../../services/project.service"
import { MatDialog } from "@angular/material/dialog"
import { ImportCategoriesModalComponent } from "./import-categories-modal/import-categories-modal.component"
import {PremiumGuardService} from "../../services/premium-guard.service";

@Component({
  selector: "app-project-category",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectSidebarComponent,
  ],
  templateUrl: "./project-category.component.html",
  styleUrl: "./project-category.component.css",
})
export class ProjectCategoryComponent implements OnInit {
  projectId = 0
  currentCategoryId?: number
  categories: Category[] = []
  categoryForm: FormGroup
  editForm = false
  searchTerm = ""

  // Loading states
  isLoading = false
  isSubmitting = false
  isDeleting = false
  deletingCategoryId?: number

  private categoryService = inject(CategoryService)
  private projectService = inject(ProjectService)
  private modalService = inject(ModalService)
  private snackBarService = inject(SnackBarService)
  private dialog = inject(MatDialog)
  private premiumGuardService = inject(PremiumGuardService)

  // Predefined colors for the color picker
  predefinedColors = [
    { name: "Rojo", value: "#F44336" },
    { name: "Rosa", value: "#E91E63" },
    { name: "Púrpura", value: "#9C27B0" },
    { name: "Azul Profundo", value: "#673AB7" },
    { name: "Índigo", value: "#3F51B5" },
    { name: "Azul", value: "#2196F3" },
    { name: "Azul Claro", value: "#03A9F4" },
    { name: "Cian", value: "#00BCD4" },
    { name: "Verde Azulado", value: "#009688" },
    { name: "Verde", value: "#4CAF50" },
    { name: "Verde Claro", value: "#8BC34A" },
    { name: "Lima", value: "#CDDC39" },
    { name: "Amarillo", value: "#FFEB3B" },
    { name: "Ámbar", value: "#FFC107" },
    { name: "Naranja", value: "#FF9800" },
    { name: "Naranja Profundo", value: "#FF5722" },
    { name: "Marrón", value: "#795548" },
    { name: "Gris", value: "#9E9E9E" },
    { name: "Azul Gris", value: "#607D8B" },
  ]

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      color: ["#4CAF50", Validators.required],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.activatedRoute.snapshot.paramMap.get("p"))
    this.loadCategories()
  }

  loadCategories(): void {
    this.isLoading = true
    this.categoryService
      .getCategories(this.projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (error: any) => {
          this.snackBarService.sendError("Error al cargar las categorías")
        },
      })
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true

      if (this.editForm) {
        this.confirmEdit()
        return
      }

      if (this.categories.length >= 10) {
        this.premiumGuardService.checkUsageLimit('categorías ilimitadas', this.categories.length, 10).subscribe({
          next: (premiumAccess) => {
            this.isSubmitting = false;
            if (premiumAccess) {
              this.executeAddNewCategory();
            }
            return;
          }
        })
      } else {
        this.executeAddNewCategory();
      }
    }
  }

  executeAddNewCategory() {
    const newCategory: CategoryDTOPost = {
      name: this.categoryForm.value.name,
      color: this.categoryForm.value.color,
      projectId: this.projectId,
    }

    this.categoryService
      .createCategory(newCategory)
      .pipe(
        finalize(() => {
          this.isSubmitting = false
        }),
      )
      .subscribe({
        next: (categorySaved) => {
          categorySaved.transactionCount = 0
          this.categories.unshift(categorySaved)
          this.categoryForm.setValue({
            name: "",
            color: "#009688",
          })
          this.snackBarService.sendSuccess("Categoría creada correctamente")
        },
        error: (error) => {
          this.snackBarService.sendError("Error al crear la categoría")
        },
      })
  }

  cancel() {
    this.editForm = false
    this.currentCategoryId = undefined
    this.categoryForm.setValue({
      name: "",
      color: "#4CAF50",
    })
  }

  editCategory(category: Category): void {
    this.editForm = true
    this.currentCategoryId = category.id
    this.categoryForm.setValue({
      name: category.name,
      color: category.color,
    })
  }

  confirmEdit() {
    if (this.currentCategoryId !== undefined) {
      const updatedCategory: CategoryDTOPut = {
        name: this.categoryForm.value.name,
        color: this.categoryForm.value.color,
      }

      this.categoryService
        .updateCategory(this.projectId, this.currentCategoryId, updatedCategory)
        .pipe(
          finalize(() => {
            this.isSubmitting = false
          }),
        )
        .subscribe({
          next: (categoryUpdate) => {
            this.cancel()
            this.loadCategories()
            this.snackBarService.sendSuccess("Categoría actualizada correctamente")
          },
          error: (error: any) => {
            this.snackBarService.sendError("Error al actualizar la categoría")
          },
        })
    }
  }

  deleteCategory(categoryId: number): void {
    this.currentCategoryId = categoryId
    this.modalService.confirmDelete("categoria").subscribe((confirmed) => {
      if (confirmed) {
        this.performDelete()
      } else {
        this.currentCategoryId = undefined
      }
    })
  }

  performDelete(): void {
    if (this.currentCategoryId !== undefined) {
      this.isDeleting = true
      this.deletingCategoryId = this.currentCategoryId

      this.categoryService
        .deleteCategory(this.projectId, this.currentCategoryId)
        .pipe(
          finalize(() => {
            this.isDeleting = false
            this.deletingCategoryId = undefined
          }),
        )
        .subscribe({
          next: () => {
            this.loadCategories()
            this.snackBarService.sendSuccess("Categoría eliminada correctamente")
          },
          error: (error) => {
            this.snackBarService.sendError("Error al eliminar la categoría")
          },
        })
    }
  }

  filterCategories(): Category[] {
    if (!this.searchTerm.trim()) {
      return this.categories
    }

    return this.categories.filter((category) => category.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }

  importCategories() {
    this.premiumGuardService.checkUsageLimit('importar categorías', 1, 0).subscribe({
      next: (premiumAccess) => {
        if (premiumAccess) {
          this.executeImport();
        }
        return;
      }
    })
  }

  executeImport() {
    this.projectService.getUserProjects().subscribe({
      next: (projects) => {
        // Filtramos para excluir el proyecto actual
        const availableProjects = projects.filter((project) => project.id !== this.projectId)

        if (availableProjects.length === 0) {
          this.snackBarService.sendInfo("No hay otros proyectos disponibles para importar categorías")
          return
        }

        const dialogRef = this.dialog.open(ImportCategoriesModalComponent, {
          width: "500px",
          data: { projects: availableProjects },
        })

        dialogRef.afterClosed().subscribe((selectedProject) => {
          if (selectedProject) {
            this.importCategoriesFromProject(selectedProject)
          }
        })
      },
      error: (error) => {
        this.snackBarService.sendError("Error al cargar los proyectos")
      },
    })
  }

  private importCategoriesFromProject(sourceProject: any): void {
    if (!sourceProject || !sourceProject.categories || sourceProject.categories.length === 0) {
      this.snackBarService.sendInfo("El proyecto seleccionado no tiene categorías para importar")
      return
    }

    // Mostrar spinner de carga
    this.isLoading = true

    // Contador para categorías importadas
    let importedCount = 0
    const totalCategories = sourceProject.categories.length

    // Procesar cada categoría secuencialmente
    const processCategories = (index: number) => {
      if (index >= sourceProject.categories.length) {
        // Todas las categorías han sido procesadas
        this.snackBarService.sendSuccess(
          `Se importaron ${importedCount} de ${totalCategories} categorías correctamente`,
        )
        this.loadCategories() // Recargar las categorías
        this.isLoading = false
        return
      }

      const category = sourceProject.categories[index]

      // Crear un nuevo objeto de categoría para importar
      const newCategory: CategoryDTOPost = {
        name: category.name,
        color: category.color,
        projectId: this.projectId,
      }

      // Crear la categoría
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          importedCount++
          // Procesar la siguiente categoría
          processCategories(index + 1)
        },
        error: (error) => {
          console.warn(`Error al importar categoría ${category.name}:`, error)
          // Continuar con la siguiente categoría incluso si hay error
          processCategories(index + 1)
        },
      })
    }

    // Iniciar el proceso con la primera categoría
    processCategories(0)
  }
}
