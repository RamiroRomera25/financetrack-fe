import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SidebarService } from "../../services/sidebar.service";

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
  menuItems = [
    { name: 'Resumen', icon: 'dashboard', route: '/project/home' },
    { name: 'Transacciones', icon: 'swap_horiz', route: '/project/transaction' },
    { name: 'Categorias', icon: 'category', route: '/project/category' },
    { name: 'Inversiones', icon: 'trending_up', route: '/inversiones' },
    { name: 'Vencimientos', icon: 'event', route: '/vencimientos' },
    { name: 'Recordatorios', icon: 'notifications', route: '/recordatorios' },
    { name: 'Metas Financieras', icon: 'flag', route: '/metas' }
  ];

  constructor(
    public sidebarService: SidebarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (event.target.innerWidth < 768) {
        this.sidebarService.close();
      } else {
        this.sidebarService.open();
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 768) {
        this.sidebarService.close();
      } else {
        this.sidebarService.open();
      }
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
}
