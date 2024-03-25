import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: any;

  constructor(private auth: AngularFireAuth,
              private router: Router) {
  }

  get isLoggedIn() {
    return localStorage.getItem('uid')

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

  sendPasswordResetEmail(email:string) {
    this.auth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent successfully');
        // Optionally, provide feedback to the user
      })
      .catch(error => {
        console.error('Error sending password reset email:', error);
        // Handle errors and provide feedback to the user
      });
  }

  async SignOut() {
    await this.auth
      .signOut();
    await this.router.navigate(['login']);
    localStorage.removeItem('user');
    localStorage.setItem('uid', 'null');
  }
}
