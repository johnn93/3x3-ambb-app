import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {DashboardComponent} from "../dashboard/dashboard.component";

const routes: Routes = [
    {path: '', component: HomepageComponent},
    {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
