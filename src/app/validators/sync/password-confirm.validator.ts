import {AbstractControl, ValidationErrors} from "@angular/forms";

export function passwordConfirmValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.parent) {
        return null;
    }

    const password = control.parent.get('password')?.value
    const confirmPassword = control.parent.get('confirmPassword')?.value

    return password !== confirmPassword ? { differentPassword: true } : null
}
