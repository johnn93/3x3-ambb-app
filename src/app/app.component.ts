import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '3x3-ambb-app';
  homepage:boolean=true;
  dashboard:boolean=false;
  constructor(private router:Router) {
  }

 ngOnInit(){
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              this.homepage = event.url !== '/';
              this.dashboard=event.url.includes('dashboard')
          }

      });
  }

}
