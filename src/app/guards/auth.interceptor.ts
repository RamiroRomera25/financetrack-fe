import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {retry, timer} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes('/api/v1/auth')) {
    return next(req);
  }

  if (authService.logged) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
  }

  return next(req).pipe(
    retry({
      count: 5,
      delay: (_error, retryCount) => timer(1000)
    })
  );
};
