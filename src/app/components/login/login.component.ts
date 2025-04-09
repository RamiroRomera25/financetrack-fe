import {Component, inject} from "@angular/core"
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl} from "@angular/forms"
import type { MatIconRegistry } from "@angular/material/icon"
import type { DomSanitizer } from "@angular/platform-browser"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCheckboxModule } from "@angular/material/checkbox"
import {AuthService} from "../../services/auth.service";
import {LoginRequest, UserDTO} from "../../models/user";

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
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent {
    private router = inject(Router);
    private authService = inject(AuthService)

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    })
    hidePassword = true


    onSubmit(): void {
        if (this.loginForm.valid) {
            const loginRequest: LoginRequest = {
                email: this.loginForm.controls.email.value,
                password: this.loginForm.controls.password.value
            }

            this.authService.authenticate(loginRequest).subscribe({
                next: (data: UserDTO) => {
                    this.router.navigate(["/"])
                },
                error: (error: any) => {
                    console.error("Error: " + error)
                }
            })
        }
    }

    goToRegister() {
        this.router.navigate([`/register`])
    }
}
