import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Tournament} from "../../../interfaces/tournament";
import {ServiceService} from "../../../shared/service.service";
import {map} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-tournament-dialog',
    templateUrl: './tournament-dialog.component.html',
    styleUrls: ['./tournament-dialog.component.scss']
})
export class TournamentDialogComponent {

    @Input() selectedTournament: Tournament | undefined
    @Input() visible: boolean = false;
    @Input() edit: boolean = false;
    @Output() newHideEvent = new EventEmitter()
    logos: any;
    allUsers: any = [];

    constructor(private fb: FormBuilder,
                private service: ServiceService) {
    }

    tournamentForm = this.fb.group({
        name: ['', Validators.required],
        date: new FormControl<Date[]>([], Validators.required),
        court: ['', Validators.required],
        city: ['', Validators.required],
        courtNo: ['', Validators.required],
        logo: ['', Validators.required],
        link: ['', Validators.required],
    })

    ngOnInit() {
        this.logos = [
            {label: 'AMBB Logo', value: 'assets/ambb-logo.png'}
        ]

        this.service.getAllUsers()
            .snapshotChanges()
            .pipe(
                map(changes =>
                    changes.map(c => {
                            return {
                                key: c.payload.key,
                                phone: c.payload.val()?.phone,
                                uid: c.payload.val()?.uid,
                                scheduledName: c.payload.val()?.scheduledName,
                            }
                        }
                    )
                )
            ).subscribe(data => {
            this.allUsers = data.sort((a: any, b: any) => {
                return a.fName?.localeCompare(b.fName!)
            });
        });
    }

    onSubmitForm() {
        const tournament: Tournament = {
            ...this.tournamentForm.value,
            period: this.tournamentForm.controls.date.value!.toString(),
            refsTotal: JSON.stringify(this.allUsers),
            refsDeclined: '[]',
            refsConfirmed: '[]',
            refsAccepted: '[]',
            supervisors: '[]'
        } as Tournament
        if(!this.edit){
            this.service.createTournament(tournament)
                .then((data)=>{
                    this.allUsers.forEach((user:any)=>{
                        user.tournaments=[...user.tournaments,{key:data.key,value:false}]
                        const userUpdate = {
                            tournaments:JSON.stringify(user.tournaments)
                        }
                        this.service.updateUser(user.key,userUpdate)
                            .then()
                    })
                })
        }else{
            const updateTournament={
                ...this.tournamentForm.value,
                period:this.tournamentForm.controls.date.value!.toString()
            }
            this.service.updateTournament(this.selectedTournament!.key,updateTournament)
                .then()
        }


    }

    onHide() {
        this.newHideEvent.emit(false)
        this.selectedTournament = undefined;
        this.clearFormValues()
    }

    clearFormValues() {
        this.tournamentForm.controls.date.setValue(null)
        this.tournamentForm.controls.name.setValue(null)
        this.tournamentForm.controls.court.setValue(null)
        this.tournamentForm.controls.city.setValue(null)
        this.tournamentForm.controls.courtNo.setValue(null)
        this.tournamentForm.controls.logo.setValue(null)
        this.tournamentForm.controls.link.setValue(null)
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes['selectedTournament'] !== undefined &&
            changes['selectedTournament'].currentValue !== undefined && this.edit) {
            this.tournamentForm.controls.date.setValue([new Date(this.selectedTournament?.period[0] || new Date()), new Date(this.selectedTournament?.period[1] || new Date())])
            this.tournamentForm.controls.name.setValue(this.selectedTournament?.name || null)
            this.tournamentForm.controls.court.setValue(this.selectedTournament?.court || null)
            this.tournamentForm.controls.city.setValue(this.selectedTournament?.city || null)
            this.tournamentForm.controls.courtNo.setValue(this.selectedTournament?.courtNo || null)
            this.tournamentForm.controls.logo.setValue(this.selectedTournament?.logo || null)
            this.tournamentForm.controls.link.setValue(this.selectedTournament?.link || null)
        }
    }

}
