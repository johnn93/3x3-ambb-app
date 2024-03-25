import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceService} from "../../../shared/service.service";
import {ActivatedRoute} from "@angular/router";
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
  defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
  uid: any;
  today: any;

  constructor(private fb: FormBuilder,
              private service: ServiceService,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loading = true;
    this.today = new Date().getFullYear().toString()
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid')
    this.service.getUserByUidTest(this.uid)
      .subscribe(data => {
        console.log(data)
        this.user = data;
        this.setForm();
        this.loading = false;
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
    this.loading = true;
    const user = {
      ...this.userFormUpdate.value,
      profileUpdated: this.today,
    }
    try {
      await this.service.updateUser(this.user.key, user)
      this.messageService.add({severity: 'success', summary: 'Success', detail: "Date actualizate cu succes"});
      this.service.getUserByUidTest(this.uid)
        .subscribe(async data => {
          this.user = data;
          this.setForm();
          this.loading = false;
        })
    } catch (error: any) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
    }
  }
}
