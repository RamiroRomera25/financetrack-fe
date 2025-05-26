import {Routes} from '@angular/router';
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
import {ProjectRemindersComponent} from "./components/project-reminders/project-reminders.component";
import {authGuard} from "./guards/auth.guard";
import {TermsconditionsComponent} from "./components/termsconditions/termsconditions.component";
import {QuestionsComponent} from "./components/questions/questions.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "terms-and-conditions", component: TermsconditionsComponent },
  { path: "questions-and-answers", component: QuestionsComponent },
  { path: "register", component: RegisterComponent },
  { path: "projects", component: ProjectDashboardComponent, canActivate: [authGuard] },
  { path: "project/home/:p", component: ProjectHomeComponent, canActivate: [authGuard] },
  { path: "project/category/:p", component: ProjectCategoryComponent, canActivate: [authGuard] },
  { path: "project/transaction/:p", component: ProjectTransactionComponent, canActivate: [authGuard] },
  { path: "project/investment/:p", component: ProjectInvestmentComponent, canActivate: [authGuard] },
  { path: "project/maturity/:p", component: ProjectMaturityComponent, canActivate: [authGuard] },
  { path: "project/goal/:p", component: ProjectGoalComponent, canActivate: [authGuard] },
  { path: "project/reminder/:p", component: ProjectRemindersComponent, canActivate: [authGuard] },
];

