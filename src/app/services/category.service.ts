import {Injectable} from '@angular/core';
import {enviroment} from "../.env/enviroment";
import {HttpClient} from "@angular/common/http";
import {Category, CategoryDTOPost, CategoryDTOPut} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  host: string = `${enviroment.categories}`

  constructor(private http: HttpClient) {}

  getCategories(projectId: number) {
    return this.http.get<Category[]>(`${this.host}/project/${projectId}`);
  }

  createCategory(categoryPost: CategoryDTOPost) {
    return this.http.post<Category>(`${this.host}`, categoryPost);
  }

  updateCategory(projectId: number, categoryId: number, categoryPut: CategoryDTOPut) {
    return this.http.put<Category>(`${this.host}/project/${projectId}/${categoryId}`, categoryPut);
  }

  deleteCategory(projectId: number, categoryId: number) {
    return this.http.delete<Category>(`${this.host}/project/${projectId}/${categoryId}`);
  }
}
