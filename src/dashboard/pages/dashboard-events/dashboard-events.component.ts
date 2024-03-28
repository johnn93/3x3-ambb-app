import {Component, ViewChild} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {debounceTime, map, Subject, Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {formatDate} from "@angular/common";
import {User} from "../../../interfaces/user";
import {Tournament} from "../../../interfaces/tournament";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './dashboard-events.component.html',
  styleUrls: ['./dashboard-events.component.scss'],
  providers: [MessageService, DialogService]
})
export class DashboardEventsComponent {

  protected readonly formatDate = formatDate;
  visible: boolean = false;
  selectedTournament: any;
  loading: boolean = false;
  isSaving: boolean = false;
  edit: boolean = false;
  allTournaments: any[] = [];
  filterFields = ['name', 'city', 'court', 'courtNo', 'refsTotal', 'refsAccepted', 'refsDeclined',]
  draggedRef: any;
  tournamentKey: string = '';
  private myObservableSubscription: Subscription | undefined;
  history: any[] = [];
  filteredTournaments: any[] = [];
  searchText: string = '';
  searchTextChanged = new Subject<string>()
  @ViewChild(ConfirmationDialogComponent) confirmationDialogComponent: ConfirmationDialogComponent | undefined;
  ref: DynamicDialogRef | undefined;
  allUsers: any;

  constructor(private service: ServiceService,
              private messageService: MessageService,
              private dialogService: DialogService) {
    this.searchTextChanged.pipe(
      debounceTime(300) // Adjust the debounce time as needed (e.g., 300 milliseconds)
    ).subscribe((searchText: string) => {
      this.filteredTournaments = this.allTournaments.filter(tournament =>
        tournament.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        tournament.period[0]?.toLowerCase().includes(searchText.toLowerCase()) ||
        tournament.period[1]?.toLowerCase().includes(searchText.toLowerCase()) ||
        (tournament.isFree === true && this.searchText.toLowerCase() === 'gratis') ||
        ((tournament.isFree === false || tournament.isFree === undefined) && this.searchText.toLowerCase() === 'cu plata') ||
        tournament.refsTotal?.some((ref: any) => ref.scheduledName.toLowerCase().includes(searchText.toLowerCase())) ||
        tournament.refsAccepted?.some((ref: any) => ref.scheduledName.toLowerCase().includes(searchText.toLowerCase())) ||
        tournament.refsDeclined?.some((ref: any) => ref.scheduledName.toLowerCase().includes(searchText.toLowerCase())) ||
        tournament.supervisors?.some((ref: any) => ref.scheduledName.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  }

  ngOnInit() {
    this.loading = true;
    this.myObservableSubscription = this.service.getTournaments()
      .subscribe(data => {
        data.sort((a: any, b: any): any => {
          let date1 = new Date(a.period[0])
          let date2 = new Date(b.period[0])
          // @ts-ignore
          return date2 - date1;
        })
        this.allTournaments = data
        this.filteredTournaments = this.allTournaments;
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
          this.loading = false;
        });
      })

  }

  filterTournaments() {
    this.searchTextChanged.next(this.searchText);
  }

  addTournament() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.edit = false;
    this.selectedTournament = null;
  }

  ngOnDestroy() {
    this.myObservableSubscription!.unsubscribe()
  }

  deleteTournament(tournament: any) {
    let emails: string[] = [];
    tournament.refsTotal.forEach((ref: any) => {
      if (ref.email !== undefined) {
        emails.push(ref.email)
      }
    })
    try {
      this.service.deleteTournament(tournament).then()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Turneu sters.'
      })
      this.sendEmail(emails, tournament, 'canceled')
    } catch (error: any) {
      this.handleError(error.detail)
    }
  }

  openConfirmationDialog(event: any) {
    this.ref = this.dialogService.open(ConfirmationDialogComponent, {
      contentStyle: {color: 'var(--text-color)', padding: '2rem', width: '20rem'},
      data: {
        tournament: event,
        message: `Turneul va fi sters definitiv. Esti sigur ?`
      },
    });
    this.ref?.onClose.subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        this.deleteTournament(event);
      }
    });
  }

  openUpdateDialog(tournament: any) {
    this.selectedTournament = tournament
    this.visible = true;
    this.edit = true;
  }

  dragStart(ref: any, key: string) {
    this.draggedRef = ref;
    this.tournamentKey = key;
  }

  dragEnd() {
    this.draggedRef = null;
  }

  drop(tournamet: any) {
    const selectedTournament = this.allTournaments.filter(tour => tour.key === tournamet.key)
    if (this.draggedRef && selectedTournament[0].key === this.tournamentKey) {
      const includes: boolean = selectedTournament[0].refsConfirmed.filter((ref: any) => ref?.uid === this.draggedRef.uid).length > 0
      if (!includes) {
        selectedTournament[0].refsConfirmed.push(this.draggedRef);
      } else {
        this.draggedRef = null;
      }
    }
  }

  dropSupervisor(tournament: any) {
    const selectedTournament = this.allTournaments.filter(tour => tour.key === tournament.key)
    if (this.draggedRef && selectedTournament[0].key === this.tournamentKey) {
      const includes: boolean = selectedTournament[0].supervisors.filter((ref: any) => ref?.uid === this.draggedRef.uid).length > 0
      if (!includes) {
        selectedTournament[0].supervisors.push(this.draggedRef);
      } else {
        this.draggedRef = null;
      }
    }
  }

  async nominate(tournament: any) {
    this.isSaving = true;
    let emails: string[] = [];
    await tournament.refsConfirmed.forEach((ref: any) => {
      if (ref.email !== undefined) {
        emails.push(ref.email)
      }
    })
    const tournamentUpdate = {
      refsTotal: JSON.stringify(tournament.refsTotal),
      refsConfirmed: JSON.stringify(tournament.refsConfirmed),
      supervisors: JSON.stringify(tournament.supervisors)
    } as Tournament
    try {
      await this.service
        .updateTournament(tournament.key, tournamentUpdate)
        .then()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Nominalizari inregistrate cu succes.'
      })
      if (tournament.refsConfirmed.length !== 0 && new Date(tournament.period[0]) > new Date()) {
        try {
          this.sendEmail(emails, tournament, 'nomination')
        } catch (error: any) {
          this.handleError(error.detail)
        }
      }
    } catch (e: any) {
      this.handleError(e.detail)
    }
    this.isSaving = false;
  }

  onRemoveRefsConfirmed(ref: User, tournament: any) {
    tournament.refsConfirmed.forEach((element: any, index: any) => {
      if (element.key === ref.key) {
        tournament.refsConfirmed.splice(index, 1)
      }
    })
  }

  onRemoveRefsTotal(ref: User, tournament: any) {
    tournament.refsTotal.forEach((element: any, index: any) => {
      if (element.key === ref.key) {
        tournament.refsTotal.splice(index, 1)
      }
    })
  }

  onRemoveSupervisor(ref: User, tournament: any) {
    tournament.supervisors.forEach((element: any, index: any) => {
      if (element.key === ref.key) {
        tournament.supervisors.splice(index, 1)
      }
    })
  }

  sendEmail(bcc: any, tournament: any, type: string) {
    if (bcc.length === 0) {
      return;
    }
    switch (type) {
      case 'nomination':
        this.service.sendNominationEmail('bicinigar@gmail.com', bcc, tournament.name, tournament.period)
          .subscribe(
            response => {
              this.messageService.add({severity: 'success', summary: 'Success', detail: "Mail-uri trimise cu succes"})
            },
            error => {
              this.handleError(error.detail)
            }
          );
        break;

      case 'canceled':
        this.service.sendCanceledTournament('bicinigar@gmail.com', ['ionut.b.alex@gmail.com'], tournament.name, tournament.period)
          .subscribe(
            response => {
              this.messageService.add({severity: 'success', summary: 'Success', detail: "Mail-uri trimise cu succes"})
            },
            error => {
              this.handleError(error.detail)
            }
          );
        break;
    }
  }

  handleError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${message}`
    })
  }

  refreshTable() {
    this.allTournaments.forEach(async tournament => {
      const updatedTournament = {
        ...tournament,
        period: tournament.period.toString(),
        refsTotal: JSON.stringify(this.allUsers),
        refsConfirmed: JSON.stringify(tournament.refsConfirmed),
        refsAccepted: JSON.stringify(tournament.refsAccepted),
        refsDeclined: JSON.stringify(tournament.refsDeclined),
        supervisors: JSON.stringify(tournament.supervisors),
      }
      await this.service.updateTournament(tournament.key, updatedTournament)
    })
  }

}
