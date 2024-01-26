import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ServiceService} from "./service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    constructor(private auth: AngularFireAuth,
                private router: Router,
                private service: ServiceService) {
    }

    SignUp(email: any, password: any) {
        return this.auth
            .createUserWithEmailAndPassword(email, password)
    }

    updateEmail(user: any) {
        return this.auth.updateCurrentUser(user)
    }

    SignIn(email: any, password: any) {
        return this.auth
            .signInWithEmailAndPassword(email, password)
    }

    SignOut() {
        return this.auth
            .signOut().then(() => {
                this.router.navigate(['login'])
                localStorage.removeItem('user')
                localStorage.setItem('uid','null')
            })
    }
}
