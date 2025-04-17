import { Injectable } from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Goal, GoalDTOPost, GoalDTOPut} from "../models/goal";

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  host: string = `${enviroment.goals}`

  constructor(private http: HttpClient) {}

  getGoals(projectId: number) {
    return this.http.get<Goal[]>(`${this.host}/project/${projectId}`);
  }

  createGoal(goalPost: GoalDTOPost) {
    return this.http.post<Goal>(`${this.host}`, goalPost);
  }

  updateGoal(projectId: number, goalId: number, goalPut: GoalDTOPut) {
    return this.http.put<Goal>(`${this.host}/project/${projectId}/${goalId}`, goalPut);
  }

  deleteGoal(projectId: number, goalId: number) {
    return this.http.delete<Goal>(`${this.host}/project/${projectId}/${goalId}`);
  }
}
