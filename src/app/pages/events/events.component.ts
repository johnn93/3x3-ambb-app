import {Component, ViewChild} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {Subscription} from "rxjs";
import {formatDate} from "@angular/common";
import {Tournament} from "../../../interfaces/tournament";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [MessageService,ConfirmationService,DialogService]
})
export class EventsComponent {

  @ViewChild(ConfirmationDialogComponent) confirmationDialogComponent: ConfirmationDialogComponent | undefined;
  ref: DynamicDialogRef | undefined;
  protected readonly formatDate = formatDate;
  startIndex: number = 0;
  sum = 15;
  allTournaments: any[] = [];
  tournaments: any[] = []
  tournament: any;
  subscription: Subscription | undefined
  profile: any;
  loading: boolean = false;
  isSaving: boolean = false;

  constructor(private service: ServiceService,
              private messageService: MessageService,
              private dialogService:DialogService) {
  }

  ngOnInit() {
    this.loading = true;
    this.getTournaments()
    this.service
      .getUserByUid(localStorage.getItem('uid'))
      .valueChanges()
      .subscribe(data => {
        this.profile = data[0];
        this.loading = false;
      })
  }

  onScroll() {
    if (this.sum <= this.allTournaments.length) {
      this.startIndex = this.sum
      this.sum += 1
      this.getTournaments()
    }
  }

  addItems(index: number, sum: number) {
    if (this.tournaments.length === this.allTournaments.length) {
      return;
    }
    for (let i = index; i < sum; ++i) {
      if (i < this.allTournaments.length)
        this.tournaments.push(this.allTournaments[i]);
    }
  }

  getTournaments() {
    this.subscription = this.service.getTournaments().subscribe(data => {
      data.sort((a: any, b: any): any => {
        let date1 = new Date(a.period[0])
        let date2 = new Date(b.period[0])
        // @ts-ignore
        return date1 - date2
      })
      this.allTournaments = data;
      this.addItems(this.startIndex, this.sum)
    })
  }

  async declined(tournament: Tournament) {
    this.isSaving = true;
    const ref = {
      uid: this.profile.uid,
      scheduledName: this.profile.scheduledName,
      phone: this.profile.phone
    }
    let totalRefs = tournament.refsTotal
    // @ts-ignore
    let index=totalRefs.findIndex(x => x.uid === this.profile.uid);
    // @ts-ignore
    totalRefs.splice(index,1)
    let declined = tournament.refsDeclined
    // @ts-ignore
    declined.push(ref)
    try {
      await this.service.updateTournament(tournament.key, {
        refsTotal:JSON.stringify(totalRefs),
        refsDeclined: JSON.stringify(declined)
      })
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Raspunsul tau a fost trimis cu succes.'
      })
      this.ngOnInit()
    } catch (e) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${e}`
      })
    }
    this.isSaving = false;
  }

  async available(tournament: Tournament):Promise<void> {
    this.isSaving = true;
    const ref = {
      uid: this.profile.uid,
      scheduledName: this.profile.scheduledName,
      phone: this.profile.phone
    }
    let totalRefs = tournament.refsTotal
    // @ts-ignore
    let index=totalRefs.findIndex(x => x.uid === this.profile.uid);
    // @ts-ignore
    totalRefs.splice(index,1)
    let accepted = tournament.refsAccepted
    // @ts-ignore
    accepted.push(ref)
    try {
      await this.service.updateTournament(tournament.key, {
        refsAccepted: JSON.stringify(accepted),
        refsTotal:JSON.stringify(totalRefs),
      })
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Raspunsul tau a fost trimis cu succes.'
      })
      this.ngOnInit()
    } catch (e) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${e}`
      })
    }
    this.isSaving = false;
  }

  checkIfAccepted(tournament: any): boolean {
    return tournament.find((value: any) => value.uid === this.profile.uid)
  }

  checkIfDeclined(tournament: any): boolean {
    return tournament.find((value: any) => value.uid === this.profile.uid)
  }

  openConfirmationDialog(event:any,isAvailable:string) {
    this.ref=this.dialogService.open(ConfirmationDialogComponent,{
      contentStyle:{color:'var(--text-color)',padding:'2rem', width:'20rem'},
      data: {
        tournament:event,
        message:`Esti sigur ca esti ${isAvailable} ?`
      },
    });
    this.ref.onClose.subscribe(async (confirmed: boolean) => {
      if (confirmed && isAvailable==='disponibil') {
        await this.available(event);
      }else if(confirmed && isAvailable==='indisponibil'){
        await this.declined(event);
      }
    });
  }
}
