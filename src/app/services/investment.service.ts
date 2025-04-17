import {Injectable} from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Investment, InvestmentDTOPost, InvestmentDTOPut} from "../models/investment";

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  host: string = `${enviroment.investments}`

  constructor(private http: HttpClient) {}

  getInvestments(projectId: number) {
    return this.http.get<Investment[]>(`${this.host}/project/${projectId}`);
  }

  createInvestment(investmentPost: InvestmentDTOPost) {
    return this.http.post<Investment>(`${this.host}`, investmentPost);
  }

  updateInvestment(projectId: number, investmentId: number, investmentPut: InvestmentDTOPut) {
    return this.http.put<Investment>(`${this.host}/project/${projectId}/${investmentId}`, investmentPut);
  }

  deleteInvestment(projectId: number, investmentId: number) {
    return this.http.delete<Investment>(`${this.host}/project/${projectId}/${investmentId}`);
  }
}
