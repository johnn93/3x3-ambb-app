import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree, CanActivate, CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "./authentication.service";
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate,CanActivateChild{
    constructor(public authService: AuthenticationService, public router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        if (!this.authService.isLoggedIn) {
            this.router.navigate(['login']);
        }
        return true;
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        if (!this.authService.isLoggedIn) {
            this.router.navigate(['login']);
            localStorage.setItem('user','null')
        }
        return true;
    }

}