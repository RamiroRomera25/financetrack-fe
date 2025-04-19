import { Component, inject } from "@angular/core"
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatIconModule } from "@angular/material/icon"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { AuthService } from "../../services/auth.service"
import { SnackBarService } from "../../services/snack-bar.service"
import type { LoginRequest } from "../../models/user"
import { finalize } from "rxjs/operators"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  private router = inject(Router)
  private authService = inject(AuthService)
  private snackBarService = inject(SnackBarService)

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  })
  hidePassword = true
  isLoading = false

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true

      const loginRequest: LoginRequest = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value,
      }

      this.authService
        .authenticate(loginRequest)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
        .subscribe({
          next: (data: any) => {
            this.authService.setToken(data.accessToken)
            this.router.navigate(["/"])
          },
          error: (error: any) => {
            console.error("Error: " + error)
            if (error.status === 401) {
              this.snackBarService.sendError("Credenciales incorrectas. Por favor, verifique su email y contraseña.")
            } else {
              this.snackBarService.sendError("Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.")
            }
          },
        })
    } else {
      this.markFormGroupTouched(this.loginForm)
    }
  }

  goToRegister() {
    this.router.navigate([`/register`])
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }
}
