import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {AuthGuard} from "../shared/auth-guard.guard";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AdminGuardGuard} from "../shared/admin-guard.guard";

const routes: Routes = [
  {
    path: '', component: HomepageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard, AdminGuardGuard]
  },
  {path: 'login', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
