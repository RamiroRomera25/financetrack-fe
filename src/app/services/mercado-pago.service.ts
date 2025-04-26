import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {enviroment} from "../.env/enviroment";

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private http = inject(HttpClient);

  host: string = `${enviroment.mercadoPago}`

  createPreference() {
    return this.http.post<any>(`${this.host}`, null);
  }
}
