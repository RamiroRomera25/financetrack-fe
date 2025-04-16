import {Component, inject, OnInit} from "@angular/core"
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
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {Category, CategoryDTOPost, CategoryDTOPut} from "../../models/category";
import {ModalService} from "../../services/modal.service";
import {SnackBarService} from "../../services/snack-bar.service";



@Component({
  selector: 'app-project-category',
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
    FormsModule,
    ReactiveFormsModule,
    ProjectSidebarComponent,
  ],
  templateUrl: './project-category.component.html',
  styleUrl: './project-category.component.css'
})
export class ProjectCategoryComponent {
  projectId: number = 0;
  currentCategoryId?: number;
  categories: Category[] = []
  categoryForm: FormGroup
  editForm: boolean = false;

  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);
  private snackBarService = inject(SnackBarService);

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

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute) {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      color: ["#4CAF50", Validators.required],
    })
  }

  ngOnInit(): void {
    this.projectId = Number(this.activatedRoute.snapshot.paramMap.get('p'));
    this.categoryService.getCategories(this.projectId).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error: any) => {

      }
    })
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {

      if (this.editForm) {
        this.confirmEdit()
        return;
      }

      const newCategory: CategoryDTOPost = {
        name: this.categoryForm.value.name,
        color: this.categoryForm.value.color,
        projectId: this.projectId
      }
      this.categoryService.createCategory(newCategory).subscribe({
        next: (categorySaved) => {
          categorySaved.transactionCount = 0;
          this.categories.unshift(categorySaved)
          this.categoryForm.setValue({
            name: "",
            color: "#009688",
          })
        }
      })
    }
  }

  cancel() {
    this.editForm = false;
    this.currentCategoryId = undefined;
    this.categoryForm.setValue({
      name: "",
      color: "#4CAF50",
    });
  }

  editCategory(category: Category): void {
    console.log(category)
    this.editForm = true;
    this.currentCategoryId = category.id;
    console.log(this.currentCategoryId)
    this.categoryForm.setValue({
      name: category.name,
      color: category.color,
    })
  }

  confirmEdit() {
    console.warn("HOLA 2")
    console.log(this.currentCategoryId)
    if (this.currentCategoryId !== undefined) {
      console.warn("HOLA 1")
      const newCategory: CategoryDTOPut = {
        name: this.categoryForm.value.name,
        color: this.categoryForm.value.color
      }

      this.categoryService.updateCategory(this.projectId, this.currentCategoryId, newCategory).subscribe({
        next: (categoryUpdate) => {
          // TODO: Cambiar
          this.cancel();
          this.ngOnInit();
        },
        error: (error: any) => {

        }
      })
    }
  }

  deleteCategory(categoryId: number): void {
    this.currentCategoryId = categoryId;
    this.modalService.confirmDelete("categoria").subscribe((confirmed) => {
      if (confirmed) {
        this.performDelete()
      } else {
        this.currentCategoryId = undefined;
      }
    })
  }

  performDelete(): void {
    if (this.currentCategoryId !== undefined) {
      this.categoryService.deleteCategory(this.projectId, this.currentCategoryId).subscribe({
        next: () => {
          this.ngOnInit()
          this.snackBarService.sendSuccess("Categoría eliminada correctamente")
        },
      })
    }
  }
}
