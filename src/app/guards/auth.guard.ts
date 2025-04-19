import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return of(authService.logged).pipe(
    map((logged) => {
      if (!logged) {
        return router.parseUrl('/login');
      }
      return true;
    })
  );
};
