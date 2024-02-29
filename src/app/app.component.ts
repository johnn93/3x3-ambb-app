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

  constructor(private router: Router,
              private service: ServiceService
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.homepage = event.url !== '/';
        this.dashboard = event.url.includes('dashboard')
      }
    });
  }

  protected readonly AuthenticationService = AuthenticationService;
  protected readonly localStorage = localStorage;
}
