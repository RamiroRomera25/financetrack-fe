import {AuthService} from "../../services/auth.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of, switchMap, timer} from "rxjs";

export const uniqueEmailValidator = (service: AuthService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const email = control.value?.trim();


        if (!email) {
            return of(null);
        }

        return timer(500).pipe(
            switchMap(() =>
                service.validEmail(email).pipe(
                    map(isAvailable => isAvailable ? null : { emailExists: true }),
                    catchError(error => {
                        return of({ serverError: true });
                    })
                )
            )
        );
    };
};
