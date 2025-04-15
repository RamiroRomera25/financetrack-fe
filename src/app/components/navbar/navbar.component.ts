import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from "@angular/router"
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

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

    goToLogin() {
        this.router.navigate([`/login`])
    }

    goToHome() {
        this.router.navigate([`/`])
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }

    goToProjects() {
        this.router.navigate([`/projects`])
    }
}
