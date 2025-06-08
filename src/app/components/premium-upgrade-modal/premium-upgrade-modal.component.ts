import {Component, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {SnackBarService} from "../../services/snack-bar.service";
import {MercadoPagoService} from "../../services/mercado-pago.service";

export interface PremiumUpgradeData {
  title?: string
  feature?: string
  benefits?: string[]
}

@Component({
  selector: 'app-premium-upgrade-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './premium-upgrade-modal.component.html',
  styleUrl: './premium-upgrade-modal.component.css'
})
export class PremiumUpgradeModalComponent {
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<PremiumUpgradeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PremiumUpgradeData,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly snackBarService: SnackBarService
  ) {}

  getBenefits(): string[] {
    return (
      this.data.benefits || [
        "Proyectos ilimitados",
        "Categorías limitados",
      ]
    )
  }

  upgradeToPremium(): void {
    if (this.isLoading) return

    this.isLoading = true
    this.snackBarService.sendInfo("Procesando su solicitud...")

    this.mercadoPagoService.createPreference().subscribe({
      next: (response) => {
        this.isLoading = false

        if (response && response.initPoint) {
          // Cerrar el modal y abrir MercadoPago
          this.dialogRef.close(true)
          window.open(response.initPoint, "_blank")
        } else {
          this.snackBarService.sendError("No se pudo iniciar el proceso de pago. Intente nuevamente.")
        }
      },
      error: (error) => {
        this.isLoading = false
        this.snackBarService.sendError(
          "Error al procesar la solicitud de actualización a Premium. Intente nuevamente más tarde.",
        )
        console.error("Error upgrading to premium:", error)
      },
    })
  }
}
