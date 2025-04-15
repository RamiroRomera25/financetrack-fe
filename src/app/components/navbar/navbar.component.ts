import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from "@angular/router"
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import {SidebarService} from "../../services/sidebar.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        RouterModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private router = inject(Router);
  protected sidebarService = inject(SidebarService)
  protected authService = inject(AuthService)

  goToLogin() {
      this.router.navigate([`/login`])
  }

  goToHome() {
      this.router.navigate([`/`])
  }

  isActive(route: string): boolean {
      return this.router.url === route;
  }

  toggleSidebar() {
    this.sidebarService.toggle()
  }

  goToProjects() {
      this.router.navigate([`/projects`])
  }

  logout() {
    this.authService.removeToken();
    this.goToLogin();
  }
}
