import {RouterModule, Routes} from "@angular/router";
import {HomepageComponent} from "./homepage.component";
import {EventsComponent} from "../events/events.component";
import {NominationsComponent} from "../nominations/nominations.component";
import {HistoryComponent} from "../history/history.component";
import {ProfileComponent} from "../profile/profile.component";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "../page-not-found/page-not-found.component";

const routes: Routes = [
    {path: 'events', component: EventsComponent},
    {path: 'nominations', component: NominationsComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'profile/:id', component: ProfileComponent},
    {path: '**', component: PageNotFoundComponent}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomepageRoutingModule {
}