import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {ConfirmationDialogComponent, ConfirmationDialogData} from "../utils/delete-modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialog = inject(MatDialog);

  // Configuración base para los diálogos
  private baseConfig: MatDialogConfig = {
    width: '450px',
    disableClose: true,
    autoFocus: true,
    panelClass: 'modern-dialog-container'
  };

  /**
   * Abre un diálogo de confirmación personalizado
   * @returns Observable<boolean> - true si se confirmó, false si se canceló
   */
  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...this.baseConfig,
      data
    });

    return dialogRef.afterClosed();
  }

  /**
   * Confirmación de eliminación con estilo de advertencia
   */
  confirmDelete(entityName: string, customMessage?: string): Observable<boolean> {
    const message = customMessage || `¿Estás seguro que deseas eliminar este ${entityName}? Esta acción no se puede deshacer.`;

    return this.confirm({
      title: `Eliminar ${entityName}`,
      message,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'error'
    });
  }

  /**
   * Confirmación genérica con estilo de pregunta
   */
  confirmAction(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: 'question'
    });
  }

  /**
   * Confirmación con estilo de éxito
   */
  success(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      type: 'success'
    });
  }

  /**
   * Advertencia con confirmación
   */
  warning(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: 'warning'
    });
  }

  /**
   * Error con confirmación
   */
  error(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Entendido',
      cancelText: 'Cerrar',
      type: 'error'
    });
  }
}
