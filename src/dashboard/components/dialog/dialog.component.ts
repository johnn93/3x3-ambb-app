import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {MessageService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../shared/authentication.service";
import {ServiceService} from "../../../shared/service.service";
import {User} from "../../../interfaces/user";
import {map} from "rxjs";
import {refsPhotos} from "./refs-photos";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    providers: [MessageService]
})
export class DialogComponent {
    @Input() selectedUser?: User;
    @Input() editMode?: boolean;
    @Input() createNewUser?: boolean;
    @Input() visible: boolean = false;
    @Output() newHideEvent = new EventEmitter();
    @Output() newUpdateEvent = new EventEmitter();
    futureTournaments: any;
    photos:any[]=[];

    constructor(private fb: FormBuilder,
                private messageService: MessageService,
                private authService: AuthenticationService,
                private service: ServiceService
    ) {
    }

    arbitriiFormSignUp = this.fb.group({
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        reEnterPassword: ['', [Validators.required, Validators.minLength(6)]],
        fName: ['', Validators.required],
        lName: ['', Validators.required],
        jersey: ['', Validators.required],
        shorts: ['', Validators.required],
        uid: [''],
        key: [''],
        phone: ['', Validators.required],
        scheduledName: ['', Validators.required],
        isAdmin: [false, Validators.required],
        photo:['',Validators.required]
    })

    arbitriiFormUpdate = this.fb.group({
        email: ['', Validators.required],
        fName: ['', Validators.required],
        lName: ['', Validators.required],
        phone: ['', Validators.required],
        scheduledName: ['', Validators.required],
        jersey: ['', Validators.required],
        shorts: ['', Validators.required],
        isAdmin: [false],
    })

    ngOnInit() {

this.photos=refsPhotos.sort((a:any,b:any)=>a.label.localeCompare(b.label))

        this.service.getAllTournaments()
            .snapshotChanges()
            .pipe(
                map(changes =>
                    changes.map(c => {
                            return {
                                key: c.payload.key,
                                name: c.payload.val()?.name,
                                period: c.payload.val()?.period.split(','),
                                court: c.payload.val()?.court,
                                city: c.payload.val()?.city,
                                courtNo: c.payload.val()?.courtNo,
                                logo: c.payload.val()?.logo,
                                link: c.payload.val()?.link,
                                refsTotal: JSON.parse(c.payload.val()!.refsTotal),
                                refsDeclined: JSON.parse(c.payload.val()!.refsDeclined),
                                refsAccepted: JSON.parse(c.payload.val().refsAccepted),
                                refsConfirmed: JSON.parse(c.payload.val()!.refsConfirmed)
                            }
                        }
                    )
                )
            ).subscribe(data => {
            if (data.length > 0) {
                this.futureTournaments = data.filter(tournament => new Date(tournament.period[0]) >= new Date())
            }
            console.log(data)
        })
    }

    resetFormValues() {
        this.arbitriiFormSignUp.reset()
    }

    onHide() {
        this.newHideEvent.emit(false);
        this.resetFormValues()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedUser'] !== undefined &&
            changes['selectedUser'].currentValue !== undefined) {
            this.arbitriiFormUpdate.controls.fName.setValue(this.selectedUser!.fName)
            this.arbitriiFormUpdate.controls.lName.setValue(this.selectedUser!.lName)
            this.arbitriiFormUpdate.controls.email.setValue(this.selectedUser!.email)
            this.arbitriiFormUpdate.controls.phone.setValue(this.selectedUser!.phone)
            this.arbitriiFormUpdate.controls.scheduledName.setValue(this.selectedUser!.scheduledName)
            this.arbitriiFormUpdate.controls.jersey.setValue(this.selectedUser!.jersey)
            this.arbitriiFormUpdate.controls.shorts.setValue(this.selectedUser!.shorts)
            this.arbitriiFormUpdate.controls.isAdmin.setValue(this.selectedUser!.isAdmin)
        }
    }

    checkIfPasswordsMatch() {
        if (this.arbitriiFormSignUp.controls.password.value != this.arbitriiFormSignUp.controls.reEnterPassword.value)
            return 'ng-invalid'
        return

    }

    onSubmitSignUp() {
        if (this.arbitriiFormSignUp.controls.password.value === this.arbitriiFormSignUp.controls.reEnterPassword.value) {
            this.authService.SignUp(this.arbitriiFormSignUp.controls.email.value, this.arbitriiFormSignUp.controls.password.value)
                .then((result) => {
                    let tournamentObject: any[] = [];
                    if (this.futureTournaments.length > 0) {
                        this.futureTournaments.forEach((tournament: any) => {
                            tournamentObject = [...tournamentObject, {key: tournament.key, value: false}]
                        })
                    }
                    const user = {
                        uid: result.user?.uid,
                        email: result.user!.email,
                        fName: this.arbitriiFormSignUp.controls.fName.value,
                        lName: this.arbitriiFormSignUp.controls.lName.value,
                        phone: this.arbitriiFormSignUp.controls.phone.value,
                        photo: this.arbitriiFormSignUp.controls.photo.value,
                        scheduledName: this.arbitriiFormSignUp.controls.scheduledName.value,
                        jersey: this.arbitriiFormSignUp.controls.jersey.value,
                        shorts: this.arbitriiFormSignUp.controls.shorts.value,
                        isAdmin: this.arbitriiFormSignUp.controls.isAdmin.value,
                        tournaments: this.futureTournaments.length > 0 ? JSON.stringify(tournamentObject) : '[]'
                    } as User
                    this.service.createUser(user)
                        .then((data)=>{
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Arbitru adaugat cu succes'
                            })
                            this.resetFormValues()
                            this.futureTournaments.forEach((tournament:any)=>{
                                let newUser={
                                    key:data.key,
                                    phone:user.phone,
                                    scheduledName:user.scheduledName,
                                    photo:user.photo
                                }
                                tournament.refsTotal = [...tournament.refsTotal,newUser];
                                const updateTournament={
                                    refsTotal:JSON.stringify(tournament.refsTotal)
                                }
                                this.service.updateTournament(tournament.key,updateTournament)
                                    .then(()=>{
                                        this.messageService.add({
                                            severity: 'success',
                                            summary: 'Success',
                                            detail: 'Arbitru adaugat cu succes in turneele viitoare'
                                        })
                                    })
                            })
                        }).catch(error=>{
                            console.log(error)
                    });

                }).catch(error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error})
            })
        } else {
            this.messageService.add({severity: 'error', summary: 'Error', detail: "Parolele nu coincid"})
        }
    }

    onSubmitUpdate() {
        this.service.updateUser(this.selectedUser!.key, this.arbitriiFormUpdate.value)
            .then(() => {
                this.newUpdateEvent.emit(true)
                this.visible = false;
            }).catch((error: any) => {
            this.newUpdateEvent.emit(error)
        })
    }
}
