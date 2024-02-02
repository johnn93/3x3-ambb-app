import {RouterModule, Routes} from "@angular/router";
import {EventsComponent} from "../events/events.component";
import {NominationsComponent} from "../nominations/nominations.component";
import {HistoryComponent} from "../history/history.component";
import {ProfileComponent} from "../profile/profile.component";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "../page-not-found/page-not-found.component";
import {AuthGuard} from "../../../shared/auth-guard.guard";

const routes: Routes = [
    {path: 'events', component: EventsComponent,canActivate:[AuthGuard]},
    {path: 'nominations', component: NominationsComponent,canActivate:[AuthGuard]},
    {path: 'history', component: HistoryComponent,canActivate:[AuthGuard]},
    {path: 'profile/:uid', component: ProfileComponent,canActivate:[AuthGuard]},
    {path: '**', component: PageNotFoundComponent}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomepageRoutingModule {
}