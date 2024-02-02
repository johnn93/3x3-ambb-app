import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    user:any;

    constructor(private auth: AngularFireAuth,
                private router: Router) {
    }

    get isLoggedIn(){
        return !!localStorage.getItem('uid')

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
