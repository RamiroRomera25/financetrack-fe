// project.service.ts
import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Project} from "../models/project";
import {enviroment} from "../.env/enviroment";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
  host: string = `${enviroment.projects}`

  constructor(private http: HttpClient) {}

  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.host}/user/list`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.host}/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.host, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.host}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/${id}`);
  }
}
