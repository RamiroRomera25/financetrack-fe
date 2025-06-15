import {Component} from "@angular/core"
import {CommonModule} from "@angular/common"
import {RouterModule} from "@angular/router"
import {MatButtonModule} from "@angular/material/button"
import {MatIconModule} from "@angular/material/icon"
import {MatCardModule} from "@angular/material/card"
import {MatDivider} from "@angular/material/divider";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
    standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatDivider],
})
export class HomeComponent {
    features = [
        {
            title: "Gestión de Categorías",
            description:
                "Organiza tus finanzas con categorías personalizadas para un seguimiento detallado de tus gastos e ingresos.",
            icon: "category",
            iconClass: "primary-icon",
        },
        {
            title: "Seguimiento de Inversiones",
            description:
                "Monitorea tus inversiones en tiempo real y genera reportes detallados para tomar mejores decisiones.",
            icon: "trending_up",
            iconClass: "secondary-icon",
        },
        {
            title: "Presupuestos Inteligentes",
            description: "Crea presupuestos personalizados y controla tus gastos para mantener tus finanzas bajo control.",
            icon: "account_balance_wallet",
            iconClass: "primary-icon",
        },
        {
            title: "Metas Financieras",
            description: "Establece metas financieras y visualiza tu progreso para alcanzar tus objetivos económicos.",
            icon: "flag",
            iconClass: "secondary-icon",
        },
        {
            title: "Recordatorios",
            description: "Configura recordatorios para pagos recurrentes y eventos financieros importantes.",
            icon: "notifications",
            iconClass: "primary-icon",
        },
        {
            title: "Reportes Detallados",
            description: "Obtén informes detallados sobre tus finanzas para entender mejor tus hábitos de gasto e ingreso.",
            icon: "bar_chart",
            iconClass: "secondary-icon",
        },
    ]

    steps = [
        {
            title: "Crea tu cuenta",
            description: "Regístrate gratis y configura tu perfil financiero personalizado.",
        },
        {
            title: "Configura tus categorías",
            description: "Personaliza las categorías para clasificar tus ingresos y gastos según tus necesidades.",
        },
        {
            title: "Establece tus metas",
            description: "Define objetivos financieros claros y crea un plan para alcanzarlos.",
        },
        {
            title: "Gestiona tus finanzas",
            description: "Registra tus transacciones, monitorea tus inversiones y recibe notificaciones importantes.",
        },
    ]

    plans = [
        {
            name: "Básico",
            price: "Gratis",
            features: [
                "Gestión de categorías básicas",
                "Seguimiento de gastos e ingresos",
                "Recordatorios limitados",
                "Hasta tres proyectos simultáneos",
                "Notificaciones por email",
            ],
            cta: "Comenzar Gratis",
            highlighted: false,
        },
        {
            name: "Premium",
            price: "$10.000 ARS",
            features: [
                "Todas las características del plan Básico",
                "Categorías ilimitadas",
                "Recordatorios ilimitadas",
                "Importar categorías entre proyectos",
                "Proyectos ilimitados",
            ],
            cta: "Obtener Premium",
            highlighted: false,
        },
    ]
}
