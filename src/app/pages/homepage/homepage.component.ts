import {Component} from '@angular/core';
import {AuthenticationService} from "../../../shared/authentication.service";
import {ADMINS} from "../../../shared/ADMINS";
import {ServiceService} from "../../../shared/service.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  userId: string | null = localStorage.getItem('uid');
  isAdmin: boolean = false;
  user: any;
  loading: boolean = false;
  defaultAvatar='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

  constructor(private authService: AuthenticationService,
              private service: ServiceService) {
  }

  menu = [
    {label: 'Turnee', link: 'events', icon: 'pi pi-calendar'},
    {label: 'Nominalizari', link: 'nominations', icon: 'pi pi-file'},
    {label: 'Istoric', link: 'history', icon: 'pi pi-history'},
    {label: 'Profil', link: `profile/${localStorage.getItem('uid')}`, icon: 'pi pi-user'},
    {label: 'Dashboard', link: 'dashboard', icon: 'pi pi-external-link'},
    {label: 'Sign Out', icon: 'pi pi-sign-out'},
  ]
  logo: any = 'assets/AMBB_coin_2024-01.png';

  ngOnInit() {
    this.loading = true;
    this.isAdmin = ADMINS.includes(localStorage.getItem('email')!)
    this.service.getUserByUidTest(this.userId)
      .subscribe(user => {
        this.user = user
        this.loading = false;
      })
  }

  async signOut() {
    await this.authService.SignOut();
  }

}

