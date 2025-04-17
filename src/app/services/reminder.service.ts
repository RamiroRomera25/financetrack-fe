import {Injectable} from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Reminder, ReminderDTOPost, ReminderDTOPut} from "../models/reminder";

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  host: string = `${enviroment.reminders}`

  constructor(private http: HttpClient) {}

  getReminders(projectId: number) {
    return this.http.get<Reminder[]>(`${this.host}/project/${projectId}`);
  }

  createReminder(reminderPost: ReminderDTOPost) {
    return this.http.post<Reminder>(`${this.host}`, reminderPost);
  }

  updateReminder(projectId: number, reminderId: number, reminderPut: ReminderDTOPut) {
    return this.http.put<Reminder>(`${this.host}/project/${projectId}/${reminderId}`, reminderPut);
  }

  deleteReminder(projectId: number, reminderId: number) {
    return this.http.delete<Reminder>(`${this.host}/project/${projectId}/${reminderId}`);
  }
}
