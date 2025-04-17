import {Injectable} from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Transaction, TransactionDTOPost, TransactionDTOPut} from "../models/Transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  host: string = `${enviroment.transactions}`

  constructor(private http: HttpClient) {}

  getTransactions(projectId: number) {
    return this.http.get<Transaction[]>(`${this.host}/project/${projectId}`);
  }

  createTransaction(transactionPost: TransactionDTOPost) {
    return this.http.post<Transaction>(`${this.host}`, transactionPost);
  }

  updateTransaction(projectId: number, transactionId: number, transactionPut: TransactionDTOPut) {
    return this.http.put<Transaction>(`${this.host}/project/${projectId}/${transactionId}`, transactionPut);
  }

  deleteTransaction(projectId: number, transactionId: number) {
    return this.http.delete<Transaction>(`${this.host}/project/${projectId}/${transactionId}`);
  }
}
