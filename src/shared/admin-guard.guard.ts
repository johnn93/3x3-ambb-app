import {Injectable} from '@angular/core';
import {CanActivate, Router,} from "@angular/router";
import {ADMINS} from "./ADMINS";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    if (!ADMINS.includes(localStorage.getItem('email')!)) {
      this.router.navigate([''])
      return false;
    }
    return true
  }

}
