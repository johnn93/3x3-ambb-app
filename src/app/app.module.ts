import {APP_INITIALIZER, isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import firebase from "firebase/compat/app";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule} from "primeng/button";
import {HomepageComponent} from './pages/homepage/homepage.component';
import {HistoryComponent} from './pages/history/history.component';
import {NominationsComponent} from './pages/nominations/nominations.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {HomepageRoutingModule} from "./pages/homepage/homepage-routing.module";
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ImageModule} from "primeng/image";
import {DashboardComponent} from '../dashboard/dashboard.component';
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
import {TournamentsNominations} from './components/tournaments-nominations/tournaments-nominations';
import {HistoryDialog} from './components/history-dialog/history-dialog';
import {DropdownModule} from "primeng/dropdown";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {CheckboxModule} from "primeng/checkbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MenuModule} from "primeng/menu";
import {getAuth, provideAuth} from "@angular/fire/auth";
// @ts-ignore
import {ServiceWorkerModule} from '@angular/service-worker';
import {MessageService} from "primeng/api";
import {ScrollTopModule} from "primeng/scrolltop";

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginPageComponent,
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
    provideAuth(() => getAuth()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    InputTextModule,
    TabMenuModule,
    FieldsetModule,
    AvatarModule,
    DividerModule,
    TabViewModule,
    InfiniteScrollModule,
    AccordionModule,
    RadioButtonModule,
    DockModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    DashboardModule,
    MenuModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ScrollTopModule
  ],
  providers: [MessageService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
