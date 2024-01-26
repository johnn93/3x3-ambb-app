import {LOCALE_ID, NgModule} from '@angular/core';
import {UsersComponent} from "./pages/users/users.component";
import {EventsComponent} from "../app/pages/events/events.component";
import { DashboardComponent } from './dashboard.component';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {DialogComponent} from "./components/dialog/dialog.component";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import {InputMaskModule} from "primeng/inputmask";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {TabMenuModule} from "primeng/tabmenu";
import {DashboardEventsComponent} from "./pages/dashboard-events/dashboard-events.component";
import { TournamentDialogComponent } from './components/tournament-dialog/tournament-dialog.component';
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {ChipModule} from "primeng/chip";
import {DragDropModule} from "primeng/dragdrop";
import {CardModule} from "primeng/card";
import {AvatarModule} from "primeng/avatar";
import {DividerModule} from "primeng/divider";


@NgModule({
    declarations: [
        UsersComponent,
        DialogComponent,
        EventsComponent,
        DialogComponent,
        DashboardEventsComponent,
        TournamentDialogComponent

    ],
    imports: [
        DashboardRoutingModule,
        CommonModule,
        ButtonModule,
        ToolbarModule,
        TableModule,
        ToastModule,
        DialogModule,
        InputSwitchModule,
        PasswordModule,
        InputMaskModule,
        ReactiveFormsModule,
        InputTextModule,
        TabMenuModule,
        CalendarModule,
        InputNumberModule,
        DropdownModule,
        ChipModule,
        DragDropModule,
        CardModule,
        AvatarModule,
        DividerModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'ro-RO' }],
    exports: [
        UsersComponent,
        DialogComponent,
    ],
    bootstrap: [DashboardComponent]
})
export class DashboardModule { }
