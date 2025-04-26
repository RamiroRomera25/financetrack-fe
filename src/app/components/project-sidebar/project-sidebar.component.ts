import {Component, HostListener, Inject, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {SidebarService} from "../../services/sidebar.service";
import {MercadoPagoService} from "../../services/mercado-pago.service";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule
  ]
})
export class ProjectSidebarComponent {
  projectId: number = 0;
  menuItems: any[] = [];
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public sidebarService: SidebarService,
    private mercadoPagoService: MercadoPagoService,
    private snackBarService: SnackBarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.projectId = Number(this.activatedRoute.snapshot.paramMap.get('p'));
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = +params.get('p')!;
      this.loadSidebarMenu();
    });
    this.loadSidebarMenu();
  }

  loadSidebarMenu() {
    // Actualizamos las rutas de los items del menú con el projectId dinámico
    this.menuItems = [
      { name: 'Resumen', icon: 'dashboard', route: `/project/home/${this.projectId}` },
      { name: 'Transacciones', icon: 'swap_horiz', route: `/project/transaction/${this.projectId}` },
      { name: 'Categorias', icon: 'category', route: `/project/category/${this.projectId}` },
      { name: 'Inversiones', icon: 'trending_up', route: `/project/investment/${this.projectId}` },
      { name: 'Vencimientos', icon: 'event', route: `/project/maturity/${this.projectId}` },
      { name: 'Recordatorios', icon: 'notifications', route: `/project/reminder/${this.projectId}` },
      { name: 'Metas Financieras', icon: 'flag', route: `/project/goal/${this.projectId}` }
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarService.close();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  // Cerrar el sidebar al hacer clic en un enlace en modo móvil
  onMenuItemClick() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 768) {
      this.sidebarService.close();
    }
  }

  // Método para manejar la actualización a premium
  upgradeToPremium() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.snackBarService.sendInfo('Procesando su solicitud...');

    this.mercadoPagoService.createPreference().subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response && response.initPoint) {
          window.open(response.initPoint, '_blank');
        } else {
          this.snackBarService.sendError('No se pudo iniciar el proceso de pago. Intente nuevamente.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBarService.sendError('Error al procesar la solicitud de actualización a Premium. Intente nuevamente más tarde.');
        console.error('Error upgrading to premium:', error);
      }
    });
  }
}
