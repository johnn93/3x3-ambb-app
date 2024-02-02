import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

    constructor() {
    }

    menu = [
        {label: 'Turnee', link: 'events', icon: 'pi pi-calendar'},
        {label: 'Nominalizari', link: 'nominations', icon: 'pi pi-file'},
        {label: 'Istoric', link: 'history', icon: 'pi pi-history'},
        {label: 'Profil', link: `profile/${localStorage.getItem('uid')}`, icon: 'pi pi-user'},
        {label: 'Dashboard', link: 'dashboard', icon: 'pi pi-external-link'},
    ]
    logo: any = 'assets/ambb-logo.png';

    ngOnInit(){
    }

}

