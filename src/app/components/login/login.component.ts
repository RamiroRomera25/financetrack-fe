import {Component, inject} from "@angular/core"
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {MatIconModule} from "@angular/material/icon"
import {Router} from "@angular/router"
import {CommonModule} from "@angular/common"
import {MatInputModule} from "@angular/material/input"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatButtonModule} from "@angular/material/button"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../models/user";

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
                next: (data: any) => {
                    this.authService.setToken(data.accessToken)
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
