import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceService} from "../../../shared/service.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    user:any={}

    constructor(private fb: FormBuilder,
                private service:ServiceService,
                private activatedRoute:ActivatedRoute) {
    }

    ngOnInit(){
        const uid = this.activatedRoute.snapshot.paramMap.get('uid')
        this.service.getUserByUid(uid)
            .subscribe(user=> {
                user.forEach(user=>{
                    if(user!=undefined){
                        this.user = user
                    }
                })
                this.setForm()
            })
    }

    userFormUpdate = this.fb.group({
        email:['',Validators.required],
        fName:['',Validators.required],
        lName:['',Validators.required],
        phone:['',Validators.required],
        jersey:['',Validators.required],
        shorts:['',Validators.required],
        scheduledName:['',Validators.required],
    })

    setForm(){
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

    onSubmitUpdate() {

    }
}
