import {AuthService} from "../../services/auth.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of, switchMap, timer} from "rxjs";
import {ProjectService} from "../../services/project.service";

export const uniqueProjectName = (service: ProjectService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const projectName = control.value?.trim();


        if (!projectName) {
            return of(null);
        }

        return timer(500).pipe(
            switchMap(() =>
                service.exists(projectName).pipe(
                    map(isAvailable => !isAvailable ? null : { projectNameExists: true }),
                    catchError(error => {
                        return of({ serverError: true });
                    })
                )
            )
        );
    };
};
