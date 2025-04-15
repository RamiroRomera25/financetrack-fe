import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {ProjectDashboardComponent} from "./components/project-dashboard/project-dashboard.component";
import {ProjectHomeComponent} from "./components/project-home/project-home.component";
import {ProjectCategoryComponent} from "./components/project-category/project-category.component";
import {ProjectTransactionComponent} from "./components/project-transaction/project-transaction.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "", component: HomeComponent },
  { path: "projects", component: ProjectDashboardComponent },
  { path: "project/home", component: ProjectHomeComponent },
  { path: "project/category", component: ProjectCategoryComponent },
  { path: "project/transaction", component: ProjectTransactionComponent },
];
