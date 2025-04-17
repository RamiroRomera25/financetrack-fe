import {inject, Injectable} from '@angular/core';
import {CustomSnackBarComponent} from "../utils/custom-snack-bar.component";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  // Configuración base común para todos los snackbars
  private baseConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  sendSuccess(message: string, duration: number = 3000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      ...this.baseConfig,
      duration,
      data: {
        message,
        icon: 'check_circle',
        iconColor: '#4caf50' // Verde más estandarizado
      },
      panelClass: ['success-snackbar']
    });
  }

  sendError(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      ...this.baseConfig,
      duration, // Los errores suelen necesitar más tiempo para leerse
      data: {
        message,
        icon: 'error',         // Icono más apropiado para errores
        iconColor: '#f44336'   // Rojo estándar de Material
      },
      panelClass: ['error-snackbar']
    });
  }

  sendWarning(message: string, duration: number = 4000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      ...this.baseConfig,
      duration,
      data: {
        message,
        icon: 'warning',       // Icono de advertencia
        iconColor: '#ff9800'   // Naranja/ámbar para advertencias
      },
      panelClass: ['warning-snackbar']
    });
  }

  sendInfo(message: string, duration: number = 3000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      ...this.baseConfig,
      duration,
      data: {
        message,
        icon: 'info',          // Icono de información
        iconColor: '#2196f3'   // Azul para información
      },
      panelClass: ['info-snackbar']
    });
  }
}
