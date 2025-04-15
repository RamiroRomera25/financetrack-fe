import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {ProjectDashboardComponent} from "./components/project-dashboard/project-dashboard.component";

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "", component: HomeComponent },
    { path: "projects", component: ProjectDashboardComponent }
];
