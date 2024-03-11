import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {ServiceService} from "../shared/service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '3x3-ambb-app';
  homepage: boolean = true;
  dashboard: boolean = false;

  protected readonly localStorage = localStorage;

  constructor(private router: Router,
              private service: ServiceService
  ) {
  }

  ngOnInit() {
    console.log(localStorage.getItem('uid'))
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.homepage = event.url !== '/';
        this.dashboard = event.url.includes('dashboard')
      }
    });
  }
}
