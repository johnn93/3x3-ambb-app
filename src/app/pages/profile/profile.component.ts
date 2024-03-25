import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceService} from "../../../shared/service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
})
export class ProfileComponent {
  user: any
  loading: boolean = false;
  defaultAvatar='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

  constructor(private fb: FormBuilder,
              private service: ServiceService,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    const uid = this.activatedRoute.snapshot.paramMap.get('uid')
    this.service.getUserByUidTest(uid)
      .subscribe(data => {
        this.user = data;
        this.loading = false;
        this.setForm();
      })
  }

  userFormUpdate = this.fb.group({
    email: ['', Validators.required],
    fName: ['', Validators.required],
    lName: ['', Validators.required],
    phone: ['', Validators.required],
    jersey: ['', Validators.required],
    shorts: ['', Validators.required],
    scheduledName: ['', Validators.required],
  })

  setForm() {
    this.userFormUpdate.controls.email.setValue(this.user.email)
    this.userFormUpdate.controls.fName.setValue(this.user.fName)
    this.userFormUpdate.controls.lName.setValue(this.user.lName)
    this.userFormUpdate.controls.phone.setValue(this.user.phone)
    this.userFormUpdate.controls.jersey.setValue(this.user.jersey)
    this.userFormUpdate.controls.shorts.setValue(this.user.shorts)
    this.userFormUpdate.controls.scheduledName.setValue(this.user.scheduledName)
    this.userFormUpdate.controls.email.disable()
    this.userFormUpdate.controls.scheduledName.disable()
  }

  async onSubmitUpdate() {
    const user = {
      ...this.userFormUpdate.value,
      profileUpdated: true,
    }
    try {
      await this.service.updateUser(this.user.key, user)
      this.messageService.add({severity: 'success', summary: 'Success', detail: "Update cu succes"})
    } catch (error: any) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: error.message})
    }
  }
}
