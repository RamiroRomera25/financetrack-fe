import {inject, Injectable} from "@angular/core"
import { Observable, of } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import { ModalService } from "./modal.service"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class PremiumGuardService {
  private modalService = inject(ModalService)
  constructor(
    private authService: AuthService,
  ) {}

  /**
   * Verifica si el usuario puede acceder a una función premium
   * Si no es premium, muestra el modal de upgrade
   * @param featureName - Nombre de la función que requiere premium
   * @returns Observable<boolean> - true si puede acceder, false si no
   */
  checkPremiumAccess(featureName: string): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (user && user.premium) {
          return of(true)
        }

        // Si no es premium, mostrar modal de upgrade
        return this.modalService.showPremiumRestriction(featureName).pipe(
          map(() => false), // Siempre retorna false para bloquear el acceso
        )
      }),
    )
  }

  /**
   * Verifica si el usuario es premium sin mostrar modal
   * @returns Observable<boolean>
   */
  isPremiumUser(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(map((user) => user?.premium || false))
  }

  /**
   * Método de conveniencia para usar en componentes
   * Ejecuta una acción solo si el usuario es premium, sino muestra el modal
   */
  executeIfPremium(featureName: string, action: () => void): void {
    this.checkPremiumAccess(featureName).subscribe((canAccess) => {
      if (canAccess) {
        action()
      }
    })
  }

  /**
   * Método para verificar límites de uso en funciones gratuitas
   * @param featureName - Nombre de la función
   * @param currentUsage - Uso actual
   * @param freeLimit - Límite gratuito
   * @returns Observable<boolean>
   */
  checkUsageLimit(featureName: string, currentUsage: number, freeLimit: number): Observable<boolean> {
    return this.isPremiumUser().pipe(
      switchMap((isPremium) => {
        // Si es premium, no hay límites
        if (isPremium) {
          return of(true)
        }

        // Si no es premium y ha alcanzado el límite
        if (currentUsage >= freeLimit) {
          return this.modalService
            .openPremiumUpgrade(featureName, [
              `Has alcanzado el límite gratuito de ${freeLimit} ${featureName.toLowerCase()}`,
              "Actualiza a Premium para acceso ilimitado",
              "Sin restricciones en todas las funciones",
            ])
            .pipe(map(() => false))
        }

        return of(true)
      }),
    )
  }
}
