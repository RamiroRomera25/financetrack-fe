import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatDividerModule } from "@angular/material/divider"
import { MatChipsModule } from "@angular/material/chips"

interface FAQ {
  id: string
  question: string
  answer: string
  category: "general" | "premium" | "technical" | "billing" | "security"
  isPremium?: boolean
}

@Component({
  selector: "app-questions",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: "./questions.component.html",
  styleUrl: "./questions.component.css",
})
export class QuestionsComponent {
  selectedCategory = "all"

  categories = [
    { id: "all", name: "Todas", icon: "list" },
    { id: "general", name: "General", icon: "help" },
    { id: "premium", name: "Premium", icon: "workspace_premium" },
    { id: "technical", name: "Técnico", icon: "settings" },
    { id: "billing", name: "Facturación", icon: "payment" },
    { id: "security", name: "Seguridad", icon: "security" },
  ]

  faqs: FAQ[] = [
    // General Questions
    {
      id: "what-is-financetrack",
      question: "¿Qué es FinanceTrack?",
      answer:
        "FinanceTrack es una aplicación completa de gestión financiera personal que te permite organizar tus finanzas, crear proyectos, categorizar transacciones, establecer metas financieras, gestionar inversiones y mucho más. Está diseñada para ayudarte a tomar el control total de tu situación financiera.",
      category: "general",
    },
    {
      id: "how-to-start",
      question: "¿Cómo empiezo a usar FinanceTrack?",
      answer:
        "Comenzar es muy fácil: 1) Crea tu cuenta gratuita 2) Configura tu primer proyecto financiero, 3) Añade categorías para organizar tus transacciones, 4) Comienza a registrar tus ingresos y gastos, 5) Establece tus primeras metas financieras. ¡En menos de 10 minutos estarás gestionando tus finanzas!",
      category: "general",
    },
    {
      id: "data-security",
      question: "¿Qué tan segura está mi información financiera?",
      answer:
        "La seguridad es nuestra máxima prioridad. Utilizamos encriptación de grado bancario (AES-256), autenticación de dos factores, servidores seguros certificados y monitoreo continuo. Nunca compartimos tu información personal con terceros y cumplimos con las regulaciones internacionales de protección de datos.",
      category: "security",
    },
    {
      id: "multiple-projects",
      question: "¿Puedo gestionar múltiples proyectos financieros?",
      answer:
        "Sí, FinanceTrack te permite crear múltiples proyectos para organizar diferentes aspectos de tu vida financiera. Por ejemplo, puedes tener un proyecto para gastos personales, otro para un negocio, y otro para planificación de vacaciones. Los usuarios gratuitos pueden crear hasta 3 proyectos, mientras que los usuarios Premium tienen proyectos ilimitados.",
      category: "general",
    },

    // Premium Questions
    {
      id: "premium-benefits",
      question: "¿Qué beneficios específicos obtengo con Premium?",
      answer:
        "Con Premium obtienes: Proyectos ilimitados.",
      category: "premium",
      isPremium: true,
    },
    {
      id: "premium-cost",
      question: "¿Cuánto cuesta la suscripción Premium?",
      answer:
        "La suscripción Premium cuesta $10000 ARS. El beneficio es vitalicio hasta que la app se cancele.",
      category: "premium",
      isPremium: true,
    },
    {
      id: "premium-trial",
      question: "¿Hay una prueba gratuita de Premium?",
      answer:
        "No, no hay una prueba gratuita del premium.",
      category: "premium",
      isPremium: true,
    },

    // Technical Questions
    {
      id: "supported-devices",
      question: "¿En qué dispositivos puedo usar FinanceTrack?",
      answer:
        "FinanceTrack está disponible como aplicación web que funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge) en computadoras, tablets y smartphones. Los usuarios Premium también tienen acceso a sincronización automática entre todos sus dispositivos.",
      category: "technical",
    },
    {
      id: "offline-access",
      question: "¿Puedo usar FinanceTrack sin conexión a internet?",
      answer:
        "Actualmente FinanceTrack requiere conexión a internet para funcionar, ya que todos los datos se sincronizan en tiempo real con nuestros servidores seguros. Estamos trabajando en una funcionalidad offline limitada que estará disponible próximamente para usuarios Premium.",
      category: "technical",
    },
    {
      id: "data-import",
      question: "¿Puedo importar datos desde otras aplicaciones?",
      answer:
        "No, actualmente no es posible importar datos desde otras apps.",
      category: "technical",
    },

    // Billing Questions
    {
      id: "payment-methods",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos los mismos metodos que soporte mercado pago.",
      category: "billing",
    },
    {
      id: "billing-cycle",
      question: "¿Cuándo se cobra la suscripción Premium?",
      answer:
        "La suscripción Premium se paga una unica vez.",
      category: "billing",
    },
    {
      id: "refund-policy",
      question: "¿Tienen política de reembolso?",
      answer:
        "No hay politica de reembolso.",
      category: "billing",
    },

    // Security Questions
    {
      id: "password-security",
      question: "¿Cómo protegen mi contraseña?",
      answer:
        "Tu contraseña se encripta usando algoritmos de hash seguros (bcrypt) antes de almacenarse. Nunca almacenamos contraseñas en texto plano. Recomendamos usar contraseñas únicas y fuertes, y ofrecemos autenticación de dos factores para mayor seguridad.",
      category: "security",
    },
    {
      id: "data-backup",
      question: "¿Hacen copias de seguridad de mis datos?",
      answer:
        "Sí, realizamos copias de seguridad automáticas de todos los datos cada 24 horas, con copias adicionales semanales y mensuales. Los datos se almacenan en múltiples ubicaciones geográficas para garantizar la máxima disponibilidad y recuperación en caso de emergencia.",
      category: "security",
    },
  ]

  get filteredFaqs(): FAQ[] {
    if (this.selectedCategory === "all") {
      return this.faqs
    }
    return this.faqs.filter((faq) => faq.category === this.selectedCategory)
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId)
    return category ? category.icon : "help"
  }
}
