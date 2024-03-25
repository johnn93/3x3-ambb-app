import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthenticationService, public router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    let lastTime = new Date(localStorage.getItem('lastTime')!)
    let expired = new Date(lastTime.setHours(lastTime.getHours() + 2))
    if (localStorage.getItem('user') == null) {
      this.router.navigate(['login'])
      return false;
    } else if (localStorage.getItem('user') != null && expired <= new Date()) {
      this.authService.SignOut().then();
      return false;
    }
    return true;
  }

}
