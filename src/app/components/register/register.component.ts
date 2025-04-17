import {Component, inject} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {provideNativeDateAdapter} from "@angular/material/core";
import {AuthService} from "../../services/auth.service";
import {UserDTO, UserDTOPost} from "../../models/user";
import {passwordConfirmValidator} from "../../validators/sync/password-confirm.validator";
import {uniqueEmailValidator} from "../../validators/async/unique-email.validator";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
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
    providers: [provideNativeDateAdapter()]
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email], [uniqueEmailValidator(this.authService)]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required, passwordConfirmValidator]),
        termsAccepted: new FormControl('', [Validators.required])
    })
    hidePassword = true;
    hideConfirmPassword = true;

    onSubmit(): void {
        if (this.registerForm.valid) {
            const userDtoPost: UserDTOPost = {
                email: this.registerForm.get('email')?.value,
                firstName: this.registerForm.get('firstName')?.value,
                lastName: this.registerForm.get('lastName')?.value,
                password: this.registerForm.get('password')?.value
            }

            this.authService.register(userDtoPost).subscribe({
                next: (data: UserDTO) => {
                    this.router.navigate(["/"])
                },
                error: (error: any) => {
                    console.error("Error: " + error)
                }
            })
        } else {
            this.markFormGroupTouched(this.registerForm);
        }
    }

    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if ((control as any).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }
}
