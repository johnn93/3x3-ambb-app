import {Component, Input} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @Input() homepage: boolean = true;
    @Input() dashboard: boolean = true;

    items: MenuItem[] | undefined = [
        {label: 'Turnee', icon: 'pi pi-calendar', routerLink: 'dashboard/tournaments'},
        {label: 'Users', icon: 'pi pi-users', routerLink: 'dashboard/users'}
    ]


}
