import { Component, OnInit } from "@angular/core"
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

interface Category {
  id: number
  name: string
  color: string
  transactionCount?: number
}

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
  categories: Category[] = []
  categoryForm: FormGroup

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

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      color: ["#4CAF50", Validators.required],
    })
  }

  ngOnInit(): void {
    // Load mock data
    this.loadMockCategories()
  }

  loadMockCategories(): void {
    this.categories = [
      { id: 1, name: "Alimentación", color: "#FF5722", transactionCount: 42 },
      { id: 2, name: "Transporte", color: "#2196F3", transactionCount: 28 },
      { id: 3, name: "Vivienda", color: "#4CAF50", transactionCount: 15 },
      { id: 4, name: "Entretenimiento", color: "#9C27B0", transactionCount: 31 },
      { id: 5, name: "Salud", color: "#F44336", transactionCount: 8 },
      { id: 6, name: "Educación", color: "#3F51B5", transactionCount: 12 },
      { id: 7, name: "Ropa", color: "#E91E63", transactionCount: 19 },
      { id: 8, name: "Tecnología", color: "#607D8B", transactionCount: 7 },
      { id: 9, name: "Mascotas", color: "#795548", transactionCount: 5 },
      { id: 10, name: "Regalos", color: "#FFC107", transactionCount: 3 },
      { id: 11, name: "Viajes", color: "#00BCD4", transactionCount: 2 },
      { id: 12, name: "Otros", color: "#9E9E9E", transactionCount: 14 },
    ]
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: this.categories.length + 1,
        name: this.categoryForm.value.name,
        color: this.categoryForm.value.color,
        transactionCount: 0,
      }

      this.categories.unshift(newCategory)
      this.categoryForm.reset({
        name: "",
        color: "#4CAF50",
      })
    }
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(category => category.id !== id)
  }

  editCategory(category: Category): void {
    // In a real application, this would open an edit form or dialog
    console.log("Edit category:", category)
  }
}
