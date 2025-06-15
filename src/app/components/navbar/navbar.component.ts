import { Component, inject } from "@angular/core"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { Router, RouterModule } from "@angular/router"
import { MatBadgeModule } from "@angular/material/badge"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../services/auth.service"
import { SidebarService } from "../../services/sidebar.service"
import { MatDialog } from "@angular/material/dialog"
import { RouteInfoModalComponent } from "./route-info-modal/route-info-modal.component"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  private router = inject(Router)
  private dialog = inject(MatDialog)
  protected authService = inject(AuthService)
  protected sidebarService = inject(SidebarService)

  // Mapeo de rutas a información detallada
  private routeInfo: { [key: string]: any } = {
    "/": {
      title: "Página Principal",
      description: "Vista general de tus proyectos financieros",
      features: ["Resumen de todos tus proyectos", "Acceso rápido a funcionalidades", "Estado general de tus finanzas"],
      tips: ["Crea tu primer proyecto para comenzar", "Revisa regularmente el estado de tus proyectos"],
    },
    "/projects": {
      title: "Gestión de Proyectos",
      description: "Crea y administra tus proyectos financieros",
      features: [
        "Crear nuevos proyectos financieros",
        "Editar proyectos existentes",
        "Eliminar proyectos no necesarios",
        "Vista general de todos los proyectos",
      ],
      tips: ["Organiza tus finanzas por proyectos específicos", "Usa nombres descriptivos para tus proyectos"],
    },
    "/project/home": {
      title: "Resumen del Proyecto",
      description: "Vista general de ingresos y gastos del proyecto actual",
      features: [
        "Gráficos de ingresos vs gastos",
        "Filtros por fecha y categoría",
        "Resumen financiero del período",
        "Análisis de tendencias",
      ],
      tips: ["Usa los filtros para analizar períodos específicos", "Revisa regularmente el balance de tu proyecto"],
    },
    "/project/transaction": {
      title: "Gestión de Transacciones",
      description: "Registra y gestiona todos tus movimientos financieros",
      features: [
        "Registrar ingresos y gastos",
        "Categorizar transacciones",
        "Filtros avanzados de búsqueda",
        "Editar y eliminar transacciones",
        "Resumen financiero en tiempo real",
      ],
      tips: [
        "Registra las transacciones tan pronto como ocurran",
        "Usa categorías consistentes para mejor análisis",
        "Aprovecha los filtros para encontrar transacciones específicas",
      ],
    },
    "/project/category": {
      title: "Gestión de Categorías",
      description: "Organiza tus transacciones por categorías personalizadas",
      features: [
        "Crear categorías personalizadas",
        "Asignar colores distintivos",
        "Importar categorías predefinidas",
        "Gestionar categorías existentes",
      ],
      tips: [
        "Crea categorías específicas para mejor organización",
        "Usa colores que te ayuden a identificar rápidamente",
      ],
    },
    "/project-goals": {
      title: "Metas Financieras",
      description: "Define y sigue el progreso de tus objetivos económicos",
      features: [
        "Establecer metas de ahorro",
        "Seguimiento de progreso",
        "Alertas de cumplimiento",
        "Análisis de viabilidad",
      ],
      tips: ["Establece metas realistas y alcanzables", "Revisa tu progreso regularmente"],
    },
    "/project-investments": {
      title: "Portafolio de Inversiones",
      description: "Gestiona y monitorea tus inversiones",
      features: [
        "Registro de inversiones",
        "Seguimiento de rendimiento",
        "Análisis de riesgo",
        "Diversificación del portafolio",
      ],
      tips: ["Diversifica tus inversiones", "Mantén un registro detallado de cada inversión"],
    },
    "/project-maturity": {
      title: "Análisis de Madurez",
      description: "Evalúa el progreso y madurez de tu proyecto financiero",
      features: [
        "Métricas de madurez financiera",
        "Análisis de tendencias",
        "Recomendaciones de mejora",
        "Comparativas temporales",
      ],
      tips: ["Usa este análisis para tomar decisiones informadas", "Revisa la madurez de tu proyecto mensualmente"],
    },
    "/project-reminders": {
      title: "Recordatorios Financieros",
      description: "Configura alertas para no olvidar tus compromisos financieros",
      features: [
        "Recordatorios de pagos",
        "Alertas de vencimientos",
        "Notificaciones personalizadas",
        "Gestión de frecuencias",
      ],
      tips: [
        "Configura recordatorios para todos tus pagos importantes",
        "Usa diferentes tipos de alertas según la urgencia",
      ],
    },
  }

  goToLogin() {
    this.router.navigate([`/login`])
  }

  goToHome() {
    this.router.navigate([`/`])
  }

  isActive(route: string): boolean {
    return this.router.url === route
  }

  goToProjects() {
    this.router.navigate([`/projects`])
  }

  logout() {
    this.authService.removeToken()
    this.goToLogin()
  }

  toggleSidebar() {
    this.sidebarService.toggle()
  }

  openRouteInfo() {
    const currentRoute = this.router.url
    let routeData = this.routeInfo[currentRoute]

    // Buscar coincidencias parciales para rutas dinámicas
    if (!routeData) {
      for (const route in this.routeInfo) {
        if (currentRoute.includes(route) && route !== "/") {
          routeData = this.routeInfo[route]
          break
        }
      }
    }

    // Datos por defecto si no se encuentra la ruta
    if (!routeData) {
      routeData = {
        title: "FinanceTrack",
        description: "Gestiona tus finanzas de manera inteligente",
        features: [
          "Control total de tus finanzas",
          "Análisis detallado de gastos e ingresos",
          "Herramientas de planificación financiera",
        ],
        tips: ["Explora todas las funcionalidades disponibles", "Mantén tus datos actualizados para mejores análisis"],
      }
    }

    this.dialog.open(RouteInfoModalComponent, {
      data: routeData,
      width: "500px",
      maxWidth: "90vw",
      panelClass: "route-info-dialog",
    })
  }
}
