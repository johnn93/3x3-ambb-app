import {UsersComponent} from "./pages/users/users.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {DashboardEventsComponent} from "./pages/dashboard-events/dashboard-events.component";

 const routes = [
    {path: '', component: DashboardComponent},
    {path: 'users', component: UsersComponent},
    {path: 'tournaments', component: DashboardEventsComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
