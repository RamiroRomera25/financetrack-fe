// project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Project} from "../models/project";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = '/api/projects';

    constructor(private http: HttpClient) {}

    getUserProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/user`).pipe(
            catchError(error => {
                console.error('Error fetching user projects', error);
                // Para demostración, devolvemos proyectos de prueba en caso de error
                return of(this.getMockProjects());
            })
        );
    }

    getProjectById(id: number): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.error(`Error fetching project with id ${id}`, error);
                const mockProject = this.getMockProjects().find(p => p.id === id);
                return of(mockProject || this.getMockProjects()[0]);
            })
        );
    }

    createProject(project: Partial<Project>): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project);
    }

    updateProject(id: number, project: Partial<Project>): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Datos simulados para pruebas
    private getMockProjects(): Project[] {
        return [
            { id: 1, name: 'Expansión Internacional', user: { id: 1, name: 'Usuario Prueba' } } as Project,
            { id: 2, name: 'Desarrollo Web', user: { id: 1, name: 'Usuario Prueba' } } as Project,
            { id: 3, name: 'Campaña Marketing Q2', user: { id: 1, name: 'Usuario Prueba' } } as Project,
            { id: 4, name: 'Renovación Oficinas', user: { id: 1, name: 'Usuario Prueba' } } as Project,
            { id: 5, name: 'Lanzamiento Producto', user: { id: 1, name: 'Usuario Prueba' } } as Project
        ];
    }
}
