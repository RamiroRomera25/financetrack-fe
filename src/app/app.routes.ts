import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {ProjectDashboardComponent} from "./components/project-dashboard/project-dashboard.component";
import {ProjectHomeComponent} from "./components/project-home/project-home.component";
import {ProjectCategoryComponent} from "./components/project-category/project-category.component";
import {ProjectTransactionComponent} from "./components/project-transaction/project-transaction.component";
import {ProjectInvestmentComponent} from "./components/project-investment/project-investment.component";
import {ProjectMaturityComponent} from "./components/project-maturity/project-maturity.component";
import {ProjectGoalComponent} from "./components/project-goal/project-goal.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "projects", component: ProjectDashboardComponent },
  { path: "project/home", component: ProjectHomeComponent },
  { path: "project/category", component: ProjectCategoryComponent },
  { path: "project/transaction", component: ProjectTransactionComponent },
  { path: "project/investment", component: ProjectInvestmentComponent },
  { path: "project/maturity", component: ProjectMaturityComponent },
  { path: "project/goal", component: ProjectGoalComponent },
];

