import {Injectable} from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Maturity, MaturityDTOPost, MaturityDTOPut} from "../models/maturity";

@Injectable({
  providedIn: 'root'
})
export class MaturityService {
  host: string = `${enviroment.maturities}`

  constructor(private http: HttpClient) {}

  getMaturities(projectId: number) {
    return this.http.get<Maturity[]>(`${this.host}/project/${projectId}`);
  }

  createMaturity(maturityPost: MaturityDTOPost) {
    return this.http.post<Maturity>(`${this.host}`, maturityPost);
  }

  updateMaturity(projectId: number, maturityId: number, maturityPut: MaturityDTOPut) {
    return this.http.put<Maturity>(`${this.host}/project/${projectId}/${maturityId}`, maturityPut);
  }

  deleteMaturity(projectId: number, maturityId: number) {
    return this.http.delete<Maturity>(`${this.host}/project/${projectId}/${maturityId}`);
  }
}
