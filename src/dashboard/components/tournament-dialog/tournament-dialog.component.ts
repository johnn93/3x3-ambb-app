import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Tournament} from "../../../interfaces/tournament";
import {ServiceService} from "../../../shared/service.service";
import {map} from "rxjs";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-tournament-dialog',
  templateUrl: './tournament-dialog.component.html',
  styleUrls: ['./tournament-dialog.component.scss'],
  providers: [MessageService]
})
export class TournamentDialogComponent {

  @Input() selectedTournament: Tournament | undefined
  @Input() visible: boolean = false;
  @Input() edit: boolean = false;
  @Output() newHideEvent = new EventEmitter()
  logos: any;
  allUsers: any = [];
  initialDate: any;
  tournamentDetails: string | undefined = '' || undefined

  constructor(private fb: FormBuilder,
              private service: ServiceService,
              private messageService: MessageService) {
  }

  tournamentForm = this.fb.group({
    name: ['', Validators.required],
    date: new FormControl<Date[]>([], Validators.required),
    court: ['', Validators.required],
    city: ['', Validators.required],
    courtNo: ['', Validators.required],
    logo: ['', Validators.required],
    link: ['', Validators.required],
    tournamentDetails: [''],
    isFree: [false]
  })

  ngOnInit() {
    this.logos = [
      {label: 'AMBB', value: 'assets/AMBB_coin_2024-01.png'},
      {label: 'ASE', value: 'assets/host-icons/ASE.png'},
      {label: 'FRB', value: 'assets/host-icons/FRBaschet.jpg'},
      {label: 'FRB 3X3', value: 'assets/host-icons/FRBaschet3x3.jpg'},
      {label: 'Sports Events', value: 'assets/host-icons/logo SE.jpg'},
      {label: 'Politehnica', value: 'assets/host-icons/Politehnica.png'},
      {label: 'Sport Arena', value: 'assets/host-icons/Sport Arena.jpg'},
      {label: 'Sport Mall', value: 'assets/host-icons/Sport Mall.png'},
      {label: 'UMF', value: 'assets/host-icons/UMF.jpg'},
      {label: 'UNEFS', value: 'assets/host-icons/UNEFS.png'},
      {label: 'FSSU', value: 'assets/host-icons/FSSU.png'},
    ]

    this.service.getAllUsers()
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => {
              return {
                key: c.payload.key,
                uid: c.payload.val()?.uid,
                scheduledName: c.payload.val()?.scheduledName,
                email: c.payload.val()?.email,
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
    const date = this.tournamentForm.controls.date.value
    let emails: any[] = [];
    this.allUsers.forEach((user: any) => {
      if (user.email !== undefined) {
        emails.push(user.email)
      }
    })
    const tournament: Tournament = {
      ...this.tournamentForm.value,
      period: this.tournamentForm.controls.date.value!.toString(),
      refsTotal: JSON.stringify(this.allUsers),
      refsDeclined: '[]',
      refsConfirmed: '[]',
      refsAccepted: '[]',
      supervisors: '[]'
    } as Tournament
    if (!this.edit) {
      this.service.createTournament(tournament)
        .then()
        .catch(e => this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${e}`
        }))
      if (new Date(tournament.period.split(',')[0]) >= new Date) {
        this.sendEmail(emails, tournament, 'created')
      }
      this.onHide()
    } else {
      let updateTournament = {}
      if (this.tournamentForm.controls.date.value![0] < new Date()) {
        updateTournament = {
          ...this.tournamentForm.value,
          period: this.tournamentForm.controls.date.value!.toString()
        }
      } else if (new Date(this.initialDate[0]).getTime() !== new Date(date![0]).getTime() || new Date(this.initialDate[1]).getTime() !== new Date(date![1]).getTime()) {
        updateTournament = {
          ...this.tournamentForm.value,
          refsTotal: JSON.stringify(this.allUsers),
          period: this.tournamentForm.controls.date.value!.toString(),
          refsDeclined: '[]',
          refsAccepted: '[]',
        }
      } else {
        updateTournament = {
          ...this.tournamentForm.value,
          refsTotal: JSON.stringify(this.allUsers),
          period: this.tournamentForm.controls.date.value!.toString(),
        }
      }
      try {
        this.service.updateTournament(this.selectedTournament!.key, updateTournament)
          .then()
        this.messageService.add({severity: 'success', summary: 'Success', detail: "Updatat cu succes"})
        this.sendEmail(emails, tournament, 'updated')
        this.onHide()
      } catch (error: any) {
        this.handleError(error.message)
      }
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
      this.initialDate = this.selectedTournament?.period
      this.tournamentDetails = this.selectedTournament?.tournamentDetails
      this.tournamentForm.controls.date.setValue([new Date(this.selectedTournament?.period[0] || new Date()), new Date(this.selectedTournament?.period[1] || new Date())])
      this.tournamentForm.controls.name.setValue(this.selectedTournament?.name || null)
      this.tournamentForm.controls.court.setValue(this.selectedTournament?.court || null)
      this.tournamentForm.controls.city.setValue(this.selectedTournament?.city || null)
      this.tournamentForm.controls.courtNo.setValue(this.selectedTournament?.courtNo || null)
      this.tournamentForm.controls.logo.setValue(this.selectedTournament?.logo || null)
      this.tournamentForm.controls.link.setValue(this.selectedTournament?.link || null)
      this.tournamentForm.controls.tournamentDetails.setValue(this.selectedTournament?.tournamentDetails || '')
      this.tournamentForm.controls.isFree.setValue(this.selectedTournament?.isFree || false)
    }
  }

  sendEmail(bcc: any, tournament: any, type: string) {
    const date = this.tournamentForm.controls.date.value
    switch (type) {
      case 'created':
        this.service.sendNewTournamentEmail('bicinigar@gmail.com', bcc, tournament.name, tournament.date)
          .subscribe(
            response => {
              this.messageService.add({severity: 'success', summary: 'Success', detail: "Mail-uri trimise cu succes"})
            },
            error => {
              this.handleError(error.message)
            }
          );
        break;
      case 'updated':
        if (new Date(this.initialDate[0]).getTime() !== new Date(date![0]).getTime() || new Date(this.initialDate[1]).getTime() !== new Date(date![1]).getTime()) {
          this.service.sendUpdateTournamentEmail('bicinigar@gmail.com', bcc, tournament.name, tournament.date)
            .subscribe(
              response => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: "Mail-uri trimise cu succes"
                });
              },
              error => {
                this.handleError(error.message)
              }
            );
        }
        break;
    }

  }

  handleError(message: string) {
    this.messageService.add({severity: 'error', summary: 'Error', detail: message})
  }

}
