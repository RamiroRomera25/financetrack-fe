import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {SidebarService} from "../../services/sidebar.service";

@Component({
    selector: 'app-project-sidebar',
    templateUrl: './project-sidebar.component.html',
    styleUrl: './project-sidebar.component.css',
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
        { name: 'Resumen', icon: 'dashboard', route: '/resumen' },
        { name: 'Transacciones', icon: 'swap_horiz', route: '/transacciones' },
        { name: 'Categorias', icon: 'category', route: '/categorias' },
        { name: 'Inversiones', icon: 'trending_up', route: '/inversiones' },
        { name: 'Vencimientos', icon: 'event', route: '/vencimientos' },
        { name: 'Recordatorios', icon: 'notifications', route: '/recordatorios' },
        { name: 'Metas Financieras', icon: 'flag', route: '/metas' }
    ];

    constructor(public sidebarService: SidebarService) {}

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (event.target.innerWidth < 768) {
            this.sidebarService.close();
        } else {
            this.sidebarService.open();
        }
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }
}
