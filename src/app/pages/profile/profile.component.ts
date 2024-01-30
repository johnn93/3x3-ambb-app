import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    constructor(private fb: FormBuilder) {
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

    onSubmitUpdate() {

    }
}
