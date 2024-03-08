import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {formatDate} from "@angular/common";
import {User} from "../../../interfaces/user";
import {Tournament} from "../../../interfaces/tournament";

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './dashboard-events.component.html',
  styleUrls: ['./dashboard-events.component.scss'],
  providers: [MessageService]
})
export class DashboardEventsComponent {

  protected readonly formatDate = formatDate;
  visible: boolean = false;
  selectedTournament: any;
  loading: boolean = false;
  isSaving: boolean = false;
  edit: boolean = false;
  allTournaments: any[] = [];
  filterFields = ['name', 'city', 'court', 'courtNo', 'refsTotal','refsAccepted','refsDeclined',]
  draggedRef: any;
  tournamentKey: string = '';
  private myObservableSubscription: Subscription | undefined;
  history: any[] = [];
  filteredTournaments: any[] = [];
  searchText: string = '';

  constructor(private service: ServiceService,
              private messageService:MessageService) {
  }

  ngOnInit() {
    this.loading=true;
    this.myObservableSubscription = this.service.getTournaments()
      .subscribe(data => {
        data.sort((a: any, b: any): any => {
          let date1 = new Date(a.period[0])
          let date2 = new Date(b.period[0])
          // @ts-ignore
          return date2-date1;
        })
        this.allTournaments = data
        this.filteredTournaments=this.allTournaments;
        this.loading=false;
      })

  }

  filterTournaments() {
    this.filteredTournaments = this.allTournaments.filter(tournament =>
      tournament.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tournament.period[0]?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tournament.period[1]?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tournament.refsTotal?.some((ref: any) => ref.scheduledName.toLowerCase().includes(this.searchText.toLowerCase())) ||
      tournament.refsAccepted?.some((ref: any) => ref.scheduledName.toLowerCase().includes(this.searchText.toLowerCase())) ||
      tournament.refsDeclined?.some((ref: any) => ref.scheduledName.toLowerCase().includes(this.searchText.toLowerCase())) ||
      tournament.supervisors?.some((ref: any) => ref.scheduledName.toLowerCase().includes(this.searchText.toLowerCase()))
    );
    return this.filteredTournaments
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
      const includes: boolean = selectedTournament[0].refsConfirmed.filter((ref: any) => ref?.key === this.draggedRef.key).length > 0
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
      const includes: boolean = selectedTournament[0].supervisors.filter((ref: any) => ref?.key === this.draggedRef.key).length > 0
      if (!includes) {
        selectedTournament[0].supervisors.push(this.draggedRef);
      } else {
        this.draggedRef = null;
      }
    }
  }

  async nominate(tournament: any) {
    this.isSaving = true;
    const tournamentUpdate = {
      refsConfirmed: JSON.stringify(tournament.refsConfirmed),
      supervisors: JSON.stringify(tournament.supervisors)
    } as Tournament
    try{
      await this.service
        .updateTournament(tournament.key, tournamentUpdate)
        .then()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Nominalizari inregistrate cu succes.'
      })
    }catch (e){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${e}`
      })
    }
    this.isSaving=false;
  }

  onRemove(ref: User, tournament: any) {
    tournament.refsConfirmed.forEach((element: any, index: any) => {
      if (element.key === ref.key) {
        tournament.refsConfirmed.splice(index, 1)
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
}
