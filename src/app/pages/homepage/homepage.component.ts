import {Component} from '@angular/core';
import {AuthenticationService} from "../../../shared/authentication.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  userId: string | null = localStorage.getItem('uid');
  constructor(private authService: AuthenticationService) {
  }

  menu = [
    {label: 'Turnee', link: 'events', icon: 'pi pi-calendar'},
    {label: 'Nominalizari', link: 'nominations', icon: 'pi pi-file'},
    {label: 'Istoric', link: 'history', icon: 'pi pi-history'},
    {label: 'Profil', link: `profile/${localStorage.getItem('uid')}`, icon: 'pi pi-user'},
    {label: 'Dashboard', link: 'dashboard', icon: 'pi pi-external-link'},
    {label: 'Sign Out', icon: 'pi pi-sign-out'},
  ]
  logo: any = 'assets/ambb-logo.png';

  ngOnInit() {
  }

  async signOut() {
    await this.authService.SignOut();
  }

}

