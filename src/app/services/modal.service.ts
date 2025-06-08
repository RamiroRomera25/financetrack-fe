import { inject, Injectable } from "@angular/core"
import { MatDialog, type MatDialogConfig } from "@angular/material/dialog"
import type { Observable } from "rxjs"
import { ConfirmationDialogComponent, type ConfirmationDialogData } from "../utils/delete-modal.component"
import {
  PremiumUpgradeModalComponent,
  type PremiumUpgradeData,
} from "../components/premium-upgrade-modal/premium-upgrade-modal.component"

@Injectable({
  providedIn: "root",
})
export class ModalService {
  private dialog = inject(MatDialog)

  // Configuración base para los diálogos
  private baseConfig: MatDialogConfig = {
    width: "450px",
    disableClose: true,
    autoFocus: true,
    panelClass: "modern-dialog-container",
  }

  /**
   * Abre un diálogo de confirmación personalizado
   * @returns Observable<boolean> - true si se confirmó, false si se canceló
   */
  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...this.baseConfig,
      data,
    })

    return dialogRef.afterClosed()
  }

  /**
   * Confirmación de eliminación con estilo de advertencia
   */
  confirmDelete(entityName: string, customMessage?: string): Observable<boolean> {
    const message =
      customMessage || `¿Estás seguro que deseas eliminar este ${entityName}? Esta acción no se puede deshacer.`

    return this.confirm({
      title: `Eliminar ${entityName}`,
      message,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "error",
    })
  }

  /**
   * Confirmación genérica con estilo de pregunta
   */
  confirmAction(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: "question",
    })
  }

  /**
   * Confirmación con estilo de éxito
   */
  success(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      type: "success",
    })
  }

  /**
   * Advertencia con confirmación
   */
  warning(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: "warning",
    })
  }

  /**
   * Error con confirmación
   */
  error(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: "Entendido",
      cancelText: "Cerrar",
      type: "error",
    })
  }

  /**
   * Abre el modal de actualización a Premium
   * @param feature - Nombre de la función que requiere premium (opcional)
   * @param customBenefits - Lista personalizada de beneficios (opcional)
   * @returns Observable<boolean> - true si el usuario procedió con la compra
   */
  openPremiumUpgrade(feature?: string, customBenefits?: string[]): Observable<boolean> {
    const data: PremiumUpgradeData = {
      feature,
      benefits: customBenefits,
    }

    const dialogRef = this.dialog.open(PremiumUpgradeModalComponent, {
      ...this.baseConfig,
      width: "520px",
      maxWidth: "95vw",
      data,
    })

    return dialogRef.afterClosed()
  }

  showPremiumRestriction(featureName: string): Observable<boolean> {
    return this.openPremiumUpgrade(featureName)
  }
}
