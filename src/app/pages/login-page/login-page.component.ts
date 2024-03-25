import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {CheckboxChangeEvent} from "primeng/checkbox";
import {EncrDecrServiceService} from "../../../shared/encr-decr-service.service";
import {AuthenticationService} from "../../../shared/authentication.service";
import {ServiceService} from "../../../shared/service.service";
import {User} from "../../../interfaces/user";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [MessageService, EncrDecrServiceService]
})
export class LoginPageComponent {

  loading = false;
  userSignIn: any;

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private message: MessageService,
              private router: Router,
              private ecrDecrService: EncrDecrServiceService,
              private service: ServiceService
  ) {
  }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    isChecked: [false]
  })

  ngOnInit() {
    this.loginForm.controls.isChecked.setValue(JSON.parse(localStorage.getItem('saveCredentials')!))
    if (localStorage.getItem('email') != null) {
      this.loginForm.controls.email.setValue(localStorage.getItem('email'))
    }
    if (localStorage.getItem('uuid') != null) {
      this.loginForm.controls.password.setValue(this.ecrDecrService.get('123456$#@$^@1ERF', localStorage.getItem('uuid')));
    }
  }

  onSubmit() {
    this.loading = true;
    this.loginForm.disable()
    this.userSignIn = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    }
    this.auth.SignIn(this.userSignIn.email, this.userSignIn.password)
      .then((result: any) => {
        if (this.loginForm.controls.isChecked.value) {
          localStorage.setItem('email', result.user!.email!)
          let encrypted = this.ecrDecrService.set('123456$#@$^@1ERF', this.userSignIn.password);
          localStorage.setItem('uuid', encrypted) //its pass but coded and also in the localstorage shows as uuid
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('uuid')
        }
        this.service.getUserByUidTest(result.user.uid)
          .subscribe((data: any) => {
            const user = data as User
            localStorage.setItem('profileUpdated', JSON.stringify(user.profileUpdated))
            localStorage.setItem('uid', result.user!.uid)
            localStorage.setItem('lastTime', result.user!.metadata.lastSignInTime!)
            localStorage.setItem('user', JSON.stringify(result.user))
            this.router.navigate([''])
            this.loginForm.enable()
            this.loading = false;
          })


      }).catch(() => {
      this.loading = false;
      this.loginForm.enable()
      this.message.add({severity: 'error', summary: 'Error', detail: 'Email or password invalid'})
    })
  }

  saveCredentials(event
                    :
                    CheckboxChangeEvent
  ) {
    localStorage.setItem('saveCredentials', event.checked)
  }
}
