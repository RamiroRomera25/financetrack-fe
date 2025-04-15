// project-dashboard.component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {Project} from "../../models/project";
import {ProjectSidebarComponent} from "../project-sidebar/project-sidebar.component";

@Component({
    selector: 'app-project-dashboard',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ProjectSidebarComponent],
    templateUrl: './project-dashboard.component.html',
    styleUrl: './project-dashboard.component.css',
    animations: [
        trigger('cardAnimation', [
            transition('void => *', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition('* => void', [
                animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.8)' }))
            ])
        ])
    ]
})
export class ProjectDashboardComponent {
    projects: Project[] = [
        { id: 1, name: 'Inversión Bienes Raíces' },
        { id: 2, name: 'Fondo de Emergencias' },
        { id: 3, name: 'Ahorro para Jubilación' },
        { id: 4, name: 'Portafolio de Acciones' },
        { id: 5, name: 'Presupuesto Vacaciones' }
    ];

    currentIndex = 0;

    get currentProject(): Project {
        return this.projects[this.currentIndex];
    }

    nextProject(): void {
        if (this.currentIndex < this.projects.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Volvemos al inicio si estamos en el último
        }
    }

    previousProject(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.projects.length - 1; // Vamos al último si estamos en el primero
        }
    }

    selectProject(index: number): void {
        this.currentIndex = index;
    }
}
