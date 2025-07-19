import { Injectable } from "@angular/core"

declare var introJs: any

@Injectable({
  providedIn: "root",
})
export class TutorialService {
  constructor() {}

  // Tutorial existente para dashboard
  startDashboardTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Finalizar! ✨",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      highlightClass: "custom-highlight",
      steps: [
        {
          title: "¡Bienvenido al Dashboard! 🎉",
          intro:
            "Este es tu panel principal donde puedes gestionar todos tus proyectos financieros. Te mostraremos cómo usar cada función.",
        },
        {
          element: '[data-intro="dashboard-main"]',
          title: "📊 Panel de Proyectos",
          intro:
            "Aquí tienes una vista general de todos tus proyectos financieros. Cada proyecto te permite organizar diferentes aspectos de tus finanzas.",
          position: "bottom",
        },
        {
          element: '[data-intro="add-project"]',
          title: "➕ Crear Nuevo Proyecto",
          intro:
            "¡El botón más importante para empezar! Haz clic aquí para crear un nuevo proyecto financiero. Puedes tener hasta 3 proyectos en el plan gratuito.",
          position: "right",
        },
        {
          element: '[data-intro="project-card"]',
          title: "💼 Tarjeta de Proyecto",
          intro:
            "Esta es la tarjeta de tu proyecto actual. Muestra el nombre y te da acceso rápido a las acciones principales.",
          position: "bottom",
        },
        {
          element: '[data-intro="edit-project"]',
          title: "✏️ Editar Proyecto",
          intro: "Haz clic aquí para cambiar el nombre de tu proyecto o modificar su configuración básica.",
          position: "right",
        },
        {
          element: '[data-intro="manage-project"]',
          title: "⚡ Administrar Proyecto",
          intro:
            "Este es el botón más importante. Te lleva al interior del proyecto donde puedes gestionar transacciones, categorías, metas y más.",
          position: "right",
        },
        {
          element: '[data-intro="delete-project"]',
          title: "🗑️ Eliminar Proyecto",
          intro: "Usa este botón con cuidado. Eliminará permanentemente el proyecto y todos sus datos asociados.",
          position: "right",
        },
        {
          element: '[data-intro="project-indicators"]',
          title: "🔘 Indicadores",
          intro:
            "Estos puntos te muestran cuántos proyectos tienes y cuál estás viendo actualmente. Puedes hacer clic en ellos para cambiar de proyecto.",
          position: "right",
        }
      ],
    })

    intro.start()

    intro.oncomplete(() => {
      console.log("Tutorial del dashboard completado")
      this.markDashboardTutorialAsCompleted()
      this.showDashboardCompletionMessage()
    })

    intro.onexit(() => {
      console.log("Tutorial del dashboard saltado")
      this.markDashboardTutorialAsCompleted()
    })
  }

  // Tutorial para la pantalla de inicio/resumen
  startHomeTutorial() {
    const intro1 = introJs()
    const intro2 = introJs()
    const intro3 = introJs()

    intro1.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "Siguiente →",
      showProgress: false,
      showBullets: false,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 100,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "📊 Panel de Control Financiero",
          intro:
            "Bienvenido a tu centro de comando financiero. Aquí tienes una vista completa de tu situación económica.",
        },
        {
          element: '[data-intro="home-filters"]',
          title: "🔍 Filtros Inteligentes",
          intro: "Filtra tus datos por fechas, categorías o montos para obtener análisis específicos de tus finanzas.",
          position: "left",
        },
        {
          element: '[data-intro="home-summary-cards"]',
          title: "💳 Resumen Financiero",
          intro: "Estas tarjetas muestran tu balance total, ingresos, gastos y tasa de ahorro de un vistazo.",
          position: "left",
        },
      ],
    })

    intro2.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "Siguiente →",
      showProgress: false,
      showBullets: false,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: false,
      scrollPadding: -100,
      tooltipClass: "custom-intro",
      steps: [
        {
          element: '[data-intro="home-charts"]',
          title: "📈 Gráficos Visuales",
          intro: "Los gráficos te ayudan a entender tus patrones de gasto e ingresos de forma visual e intuitiva.",
          position: "bottom",
          scroll: false,
          scrollTo: false,
          scrollBy: false
        },
      ]
    })

    intro3.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Perfecto! 🚀",
      showProgress: false,
      showBullets: false,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 100,
      tooltipClass: "custom-intro",
      steps: [
        {
          element: '[data-intro="home-recent-transactions"]',
          title: "🔄 Transacciones Recientes",
          intro: "Ve tus últimas 5 transacciones para mantener un control inmediato de tu actividad financiera.",
          position: "right",
        },
        {
          element: '[data-intro="home-goals"]',
          title: "🎯 Progreso de Metas",
          intro: "Monitorea el avance hacia tus objetivos financieros y mantente motivado.",
          position: "top",
        },
        {
          element: '[data-intro="home-investments"]',
          title: "💼 Cartera de Inversiones",
          intro: "Revisa el rendimiento de tus inversiones y el valor total de tu portafolio.",
          position: "top",
        },
        {
          element: '[data-intro="home-maturities"]',
          title: "⏰ Próximos Vencimientos",
          intro: "Mantente al día con pagos y vencimientos importantes para evitar penalizaciones.",
          position: "top",
        },
      ]
    })

    intro1.start()

    intro1.oncomplete(() => {
      intro2.start();
      intro2.oncomplete(() => {
        intro3.start();
      })
    })

    this.markTutorialAsCompleted("home")
  }

  // Tutorial para transacciones
  startTransactionTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Listo para registrar! 💰",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "💰 Gestión de Transacciones",
          intro: "Aquí registras todos tus movimientos financieros. Es la base de tu control económico personal.",
        },
        {
          element: '[data-intro="transaction-form"]',
          title: "📝 Formulario de Registro",
          intro: "Usa este formulario para agregar nuevas transacciones rápida y fácilmente.",
          position: "right",
        },
        {
          element: '[data-intro="transaction-type"]',
          title: "🔄 Tipo de Transacción",
          intro:
            "Selecciona si es un ingreso (dinero que entra) o un gasto (dinero que sale). Esto afecta cómo se calcula tu balance.",
          position: "right",
        },
        {
          element: '[data-intro="transaction-amount"]',
          title: "💵 Monto",
          intro:
            "Ingresa la cantidad exacta de la transacción. Solo números positivos, el tipo determina si suma o resta.",
          position: "right",
        },
        {
          element: '[data-intro="transaction-category"]',
          title: "🏷️ Categoría",
          intro: "Asigna cada transacción a una categoría para organizar mejor tus finanzas y generar reportes útiles.",
          position: "right",
        },
        {
          element: '[data-intro="transaction-submit"]',
          title: "✅ Guardar Transacción",
          intro: "Una vez completados los datos, haz clic aquí para registrar la transacción en tu historial.",
          position: "right",
        },
        {
          element: '[data-intro="transaction-summary"]',
          title: "📊 Resumen Rápido",
          intro: "Ve tu balance total, ingresos y gastos actualizados en tiempo real con cada transacción.",
          position: "bottom",
        },
        {
          element: '[data-intro="transaction-filters"]',
          title: "🔍 Filtros Avanzados",
          intro:
            "Filtra tus transacciones por categoría, fecha o monto para encontrar información específica rápidamente.",
          position: "bottom",
        },
        {
          element: '[data-intro="transaction-table"]',
          title: "📋 Historial de Transacciones",
          intro: "Todas tus transacciones aparecen aquí. Puedes editarlas o eliminarlas usando los botones de acción.",
          position: "top",
        },
        {
          element: '[data-intro="transaction-actions"]',
          title: "⚙️ Acciones",
          intro: "Cada transacción tiene botones para editar o eliminar. Úsalos para mantener tu registro actualizado.",
          position: "left",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("transaction")
  }

  // Tutorial para categorías
  startCategoryTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡A organizar! 🏷️",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "🏷️ Organización por Categorías",
          intro:
            "Las categorías te ayudan a organizar tus gastos e ingresos para entender mejor en qué gastas tu dinero.",
        },
        {
          element: '[data-intro="category-form"]',
          title: "📝 Crear Nueva Categoría",
          intro: "Usa este formulario para crear categorías personalizadas que se adapten a tu estilo de vida.",
          position: "right",
        },
        {
          element: '[data-intro="category-name"]',
          title: "✏️ Nombre de Categoría",
          intro: "Elige un nombre descriptivo como 'Alimentación', 'Transporte', 'Entretenimiento', etc.",
          position: "right",
        },
        {
          element: '[data-intro="category-color"]',
          title: "🎨 Color Identificativo",
          intro:
            "Selecciona un color único para cada categoría. Esto te ayudará a identificarlas rápidamente en gráficos y reportes.",
          position: "right",
        },
        {
          element: '[data-intro="category-search"]',
          title: "🔍 Buscar Categorías",
          intro: "Usa la barra de búsqueda para encontrar categorías específicas cuando tengas muchas creadas.",
          position: "bottom",
        },
        {
          element: '[data-intro="category-import"]',
          title: "📥 Importar Categorías",
          intro: "¿Tienes otro proyecto? Puedes importar categorías existentes para ahorrar tiempo (función Premium).",
          position: "bottom",
        },
        {
          element: '[data-intro="category-list"]',
          title: "📋 Lista de Categorías",
          intro: "Aquí ves todas tus categorías con su color, nombre y cuántas transacciones tiene cada una.",
          position: "top",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("category")
  }

  // Tutorial para inversiones
  startInvestmentTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡A invertir! 📈",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "📈 Gestión de Inversiones",
          intro:
            "Rastrea tus inversiones en acciones, bonos, criptomonedas y otros instrumentos financieros en un solo lugar.",
        },
        {
          element: '[data-intro="investment-form"]',
          title: "📝 Registrar Inversión",
          intro:
            "Usa este formulario para agregar nuevas inversiones a tu portafolio y mantener un registro actualizado.",
          position: "right",
        },
        {
          element: '[data-intro="investment-ticker"]',
          title: "🏷️ Símbolo/Ticker",
          intro:
            "Ingresa el símbolo de la acción o inversión (ej: AAPL, TSLA, BTC). Esto identifica únicamente tu inversión.",
          position: "right",
        },
        {
          element: '[data-intro="investment-quantity"]',
          title: "🔢 Cantidad",
          intro: "Especifica cuántas acciones, unidades o fracciones de la inversión posees.",
          position: "right",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("investment")
  }

  // Tutorial para recordatorios
  startReminderTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Nunca más olvidos! 🔔",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "🔔 Sistema de Recordatorios",
          intro:
            "Nunca olvides pagos importantes, fechas de vencimiento o tareas financieras con nuestro sistema de recordatorios.",
        },
        {
          element: '[class="reminder-form"]',
          title: "📝 Crear Recordatorio",
          intro: "Usa este formulario para configurar recordatorios personalizados para tus tareas financieras.",
          position: "right",
        },
        {
          element: '[data-intro="reminder-subject"]',
          title: "✏️ Asunto del Recordatorio",
          intro: "Describe claramente qué necesitas recordar: 'Pagar tarjeta de crédito', 'Revisar inversiones', etc.",
          position: "right",
        },
        {
          element: '[data-intro="reminder-date"]',
          title: "📅 Fecha del Recordatorio",
          intro:
            "Selecciona cuándo quieres recibir el recordatorio. Puede ser el día del vencimiento o unos días antes.",
          position: "right",
        },
        {
          element: '[data-intro="reminder-submit"]',
          title: "✅ Guardar Recordatorio",
          intro: "Crea el recordatorio y el sistema te alertará en la fecha programada.",
          position: "right",
        },
        {
          element: '[data-intro="reminder-summary"]',
          title: "📊 Resumen de Recordatorios",
          intro: "Ve cuántos recordatorios tienes próximos y cuántos están vencidos para priorizar tus tareas.",
        },
        {
          element: '[data-intro="reminder-search"]',
          title: "🔍 Buscar Recordatorios",
          intro: "Encuentra recordatorios específicos por su asunto o descripción.",
          position: "bottom",
        },
        {
          element: '[data-intro="reminder-filters"]',
          title: "🔍 Filtros de Estado",
          intro: "Filtra recordatorios por estado: todos, próximos, de hoy o vencidos para organizar mejor tu agenda.",
          position: "bottom",
        },
        {
          element: '[data-intro="reminder-sort"]',
          title: "📊 Ordenar por Fecha",
          intro: "Ordena tus recordatorios por fecha ascendente o descendente para ver las prioridades.",
          position: "bottom",
        },
        {
          element: '[data-intro="reminder-list"]',
          title: "📋 Lista de Recordatorios",
          intro: "Todos tus recordatorios aparecen aquí con códigos de color según su urgencia y estado.",
          position: "top",
        },
        {
          element: '[data-intro="reminder-status"]',
          title: "🚦 Estados de Recordatorios",
          intro: "Los colores indican urgencia: rojo para vencidos, amarillo para próximos, verde para futuros.",
          position: "left",
        },
        {
          element: '[data-intro="reminder-actions"]',
          title: "⚙️ Gestionar Recordatorios",
          intro: "Puedes editar la fecha o descripción, o eliminar recordatorios que ya no necesites.",
          position: "left",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("reminder")
  }

  // Tutorial para vencimientos
  startMaturityTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Control total! 📅",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "📅 Gestión de Vencimientos",
          intro:
            "Controla todas tus fechas importantes: tarjetas de crédito, préstamos, seguros y otros compromisos financieros.",
        },
        {
          element: '[data-intro="maturity-form"]',
          title: "📝 Registrar Vencimiento",
          intro:
            "Usa este formulario para agregar nuevos vencimientos y mantener un control estricto de tus obligaciones.",
          position: "right",
        },
        {
          element: '[data-intro="maturity-amount"]',
          title: "💰 Monto del Vencimiento",
          intro: "Ingresa el monto que debes pagar. Esto te ayuda a planificar tu flujo de efectivo.",
          position: "right",
        },
        {
          element: '[data-intro="maturity-date"]',
          title: "📅 Fecha de Vencimiento",
          intro: "Selecciona la fecha exacta en que vence el pago para evitar penalizaciones por retraso.",
          position: "right",
        },
        {
          element: '[data-intro="maturity-state"]',
          title: "🏷️ Estado del Vencimiento",
          intro: "Al editar, puedes cambiar el estado: En Espera, Notificado, Resuelto o Atrasado.",
          position: "right",
        },
        {
          element: '[data-intro="maturity-submit"]',
          title: "✅ Guardar Vencimiento",
          intro: "Registra el vencimiento en tu sistema para recibir alertas oportunas.",
          position: "right",
        },
        {
          element: '[data-intro="maturity-summary"]',
          title: "📊 Resumen de Vencimientos",
          intro: "Ve el total de vencimientos, monto total y cuántos vencen en los próximos 7 días.",
          position: "bottom",
        },
        {
          element: '[data-intro="maturity-search"]',
          title: "🔍 Buscar Vencimientos",
          intro: "Encuentra vencimientos específicos por su ID o descripción.",
          position: "bottom",
        },
        {
          element: '[data-intro="maturity-filters"]',
          title: "🔍 Filtros por Estado",
          intro: "Filtra por estado para ver solo los vencimientos pendientes, resueltos o atrasados.",
          position: "bottom",
        },
        {
          element: '[data-intro="maturity-sort"]',
          title: "📊 Ordenar Vencimientos",
          intro: "Ordena por fecha o monto para priorizar qué vencimientos atender primero.",
          position: "bottom",
        },
        {
          element: '[data-intro="maturity-list"]',
          title: "📋 Lista de Vencimientos",
          intro: "Todos tus vencimientos con códigos de color según su urgencia y días restantes.",
          position: "top",
        },
        {
          element: '[data-intro="maturity-urgency"]',
          title: "🚨 Indicadores de Urgencia",
          intro:
            "Los colores y iconos indican urgencia: rojo para vencidos, amarillo para próximos, verde para futuros.",
          position: "left",
        },
        {
          element: '[data-intro="maturity-actions"]',
          title: "⚙️ Gestionar Vencimientos",
          intro: "Puedes editar montos, fechas y estados, o eliminar vencimientos que ya no apliquen.",
          position: "left",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("maturity")
  }

  // Tutorial para metas financieras
  startGoalTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡A cumplir metas! 🎯",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "🎯 Metas Financieras",
          intro:
            "Define y rastrea tus objetivos financieros para mantener la motivación y alcanzar tus sueños económicos.",
        },
        {
          element: '[data-intro="goal-form"]',
          title: "📝 Crear Nueva Meta",
          intro: "Usa este formulario para definir metas financieras claras y alcanzables.",
          position: "right",
        },
        {
          element: '[data-intro="goal-objective"]',
          title: "🎯 Objetivo de la Meta",
          intro: "Describe claramente tu meta: 'Ahorrar para vacaciones', 'Fondo de emergencia', 'Comprar auto', etc.",
          position: "right",
        },
        {
          element: '[data-intro="goal-amount"]',
          title: "💰 Monto Objetivo",
          intro: "Especifica cuánto dinero necesitas ahorrar para alcanzar tu meta financiera.",
          position: "right",
        },
        {
          element: '[data-intro="goal-date"]',
          title: "📅 Fecha Límite",
          intro:
            "Establece una fecha realista para alcanzar tu meta. Esto te ayuda a mantener el enfoque y la disciplina.",
          position: "right",
        },
        {
          element: '[data-intro="goal-notes"]',
          title: "📝 Notas Adicionales",
          intro: "Agrega detalles extra sobre tu meta: estrategias, motivaciones o recordatorios personales.",
          position: "right",
        },
        {
          element: '[data-intro="goal-submit"]',
          title: "✅ Crear Meta",
          intro: "Guarda tu meta y comienza a trabajar hacia su cumplimiento.",
          position: "right",
        },
        {
          element: '[data-intro="goal-summary"]',
          title: "📊 Resumen de Metas",
          intro: "Ve el monto total de todas tus metas y cuál es la más próxima a vencer.",
          position: "bottom",
        },
        {
          element: '[data-intro="goal-search"]',
          title: "🔍 Buscar Metas",
          intro: "Encuentra metas específicas por su nombre u objetivo cuando tengas varias activas.",
          position: "bottom",
        },
        {
          element: '[data-intro="goal-sort"]',
          title: "📊 Ordenar Metas",
          intro: "Ordena tus metas por fecha límite o monto para priorizar en cuáles enfocarte.",
          position: "bottom",
        },
        {
          element: '[data-intro="goal-list"]',
          title: "📋 Lista de Metas",
          intro: "Todas tus metas financieras con indicadores visuales de tiempo restante y urgencia.",
          position: "top",
        },
        {
          element: '[data-intro="goal-progress"]',
          title: "📈 Indicadores de Progreso",
          intro:
            "Los colores indican el tiempo restante: rojo para urgentes, amarillo para próximas, verde para futuras.",
          position: "left",
        },
        {
          element: '[data-intro="goal-actions"]',
          title: "⚙️ Gestionar Metas",
          intro: "Puedes editar objetivos, montos y fechas, o eliminar metas que ya no sean relevantes.",
          position: "left",
        },
      ],
    })

    intro.start()
    this.markTutorialAsCompleted("goal")
  }

  // Tutorial existente para home (landing)
  startLandingTutorial() {
    const intro = introJs()

    intro.setOptions({
      nextLabel: "Siguiente →",
      prevLabel: "← Anterior",
      skipLabel: "➡",
      doneLabel: "¡Comenzar ahora! 🚀",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      disableInteraction: true,
      scrollToElement: true,
      scrollPadding: 30,
      tooltipClass: "custom-intro",
      steps: [
        {
          title: "¡Bienvenido a FinanceTrack! 🌟",
          intro:
            "Descubre cómo nuestra plataforma revolucionará la forma en que gestionas tus finanzas personales. ¡Empecemos este recorrido!",
        },
        {
          element: '[data-intro="hero-section"]',
          title: "🏠 Tu Solución Financiera",
          intro:
            "FinanceTrack es tu herramienta todo-en-uno para el control total de tus finanzas personales y familiares.",
          position: "bottom",
        },
        {
          element: '[data-intro="cta-buttons"]',
          title: "🚀 Comienza Tu Viaje",
          intro: "Crea tu cuenta gratuita en segundos o inicia sesión si ya formas parte de nuestra comunidad.",
          position: "bottom",
        },
      ],
    })

    intro.start()

    intro.oncomplete(() => {
      console.log("Tutorial de landing completado")
      this.markTutorialAsCompleted("landing")
      // Redirigir al registro después del tutorial
      window.location.href = "/register"
    })

    intro.onexit(() => {
      console.log("Tutorial de landing saltado")
      this.markTutorialAsCompleted("landing")
    })
  }

  // Métodos de utilidad
  private markTutorialAsCompleted(tutorialName: string) {
    localStorage.setItem(`${tutorialName}TutorialCompleted`, "true")
  }

  shouldShowTutorial(tutorialName: string): boolean {
    return !localStorage.getItem(`${tutorialName}TutorialCompleted`)
  }

  private markDashboardTutorialAsCompleted() {
    localStorage.setItem("dashboardTutorialCompleted", "true")
  }

  shouldShowDashboardTutorial(): boolean {
    return !localStorage.getItem("dashboardTutorialCompleted")
  }

  private showDashboardCompletionMessage() {
    const intro = introJs()
    intro.setOptions({
      steps: [
        {
          title: "🎉 ¡Perfecto!",
          intro:
            "Ahora conoces tu dashboard. ¡Es hora de crear tu primer proyecto y comenzar a gestionar tus finanzas como un profesional!",
        },
      ],
      showButtons: false,
      showBullets: false,
      showProgress: false,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      doneLabel: "¡Entendido!",
    })

    setTimeout(() => {
      intro.start()
      setTimeout(() => intro.exit(), 4000) // Auto-cerrar después de 4 segundos
    }, 500)
  }

  // Método para iniciar tutorial específico
  startTutorial(tutorialName: string) {
    switch (tutorialName) {
      case "dashboard":
        this.startDashboardTutorial()
        break
      case "home":
        this.startHomeTutorial()
        break
      case "transaction":
        this.startTransactionTutorial()
        break
      case "category":
        this.startCategoryTutorial()
        break
      case "investment":
        this.startInvestmentTutorial()
        break
      case "reminder":
        this.startReminderTutorial()
        break
      case "maturity":
        this.startMaturityTutorial()
        break
      case "goal":
        this.startGoalTutorial()
        break
      case "landing":
        this.startLandingTutorial()
        break
      default:
        console.warn(`Tutorial '${tutorialName}' no encontrado`)
    }
  }

  // Método para resetear todos los tutoriales (útil para desarrollo/testing)
  resetAllTutorials() {
    const tutorials = [
      "dashboard",
      "home",
      "transaction",
      "category",
      "investment",
      "reminder",
      "maturity",
      "goal",
      "landing",
    ]
    tutorials.forEach((tutorial) => {
      localStorage.removeItem(`${tutorial}TutorialCompleted`)
    })
    localStorage.removeItem("dashboardTutorialCompleted")
    console.log("Todos los tutoriales han sido reseteados")
  }
}
