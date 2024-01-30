import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import firebase from "firebase/compat/app";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule} from "primeng/button";
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HistoryComponent } from './pages/history/history.component';
import { NominationsComponent } from './pages/nominations/nominations.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {HomepageRoutingModule} from "./pages/homepage/homepage-routing.module";
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {ImageModule} from "primeng/image";
import { DashboardComponent } from '../dashboard/dashboard.component';
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {ToolbarModule} from "primeng/toolbar";
import {environment} from "../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputTextModule} from "primeng/inputtext";
import {TabMenuModule} from "primeng/tabmenu";
import {DashboardModule} from "../dashboard/dashboard.module";
import {FieldsetModule} from "primeng/fieldset";
import {AvatarModule} from "primeng/avatar";
import {DividerModule} from "primeng/divider";
import {TabViewModule} from "primeng/tabview";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {AccordionModule} from "primeng/accordion";
import {RadioButtonModule} from "primeng/radiobutton";
import {DockModule} from "primeng/dock";
import { TournamentsNominations } from './components/tournaments-nominations/tournaments-nominations';
import { HistoryDialog } from './components/history-dialog/history-dialog';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        HistoryComponent,
        NominationsComponent,
        ProfileComponent,
        PageNotFoundComponent,
        NavbarComponent,
        DashboardComponent,
        TournamentsNominations,
        HistoryDialog,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ButtonModule,
        HomepageRoutingModule,
        ImageModule,
        ToastModule,
        TableModule,
        DialogModule,
        ReactiveFormsModule,
        PasswordModule,
        InputMaskModule,
        InputSwitchModule,
        ToolbarModule,
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        InputTextModule,
        TabMenuModule,
        DashboardModule,
        FieldsetModule,
        AvatarModule,
        DividerModule,
        TabViewModule,
        InfiniteScrollModule,
        AccordionModule,
        RadioButtonModule,
        DockModule
    ],
    providers: [],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
