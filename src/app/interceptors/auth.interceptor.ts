import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Si el servidor nos dice que no estamos autorizados (sesión revocada o expirada),
        // redirigimos directamente al login.
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
