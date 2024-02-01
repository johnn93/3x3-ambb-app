import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {map, Subscription} from "rxjs";
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

    visible: boolean = false;
    selectedTournament: any;
    loading: boolean = false;
    edit: boolean = false;
    allTournaments: any[] = [];
    filterFields = ['name','city','court','courtNo','period',]
    draggedRef: any;
    tournamentKey: string = '';
    private myObservableSubscription: Subscription | undefined;
    protected readonly formatDate = formatDate;
    history: any[] = [];

    constructor(private service: ServiceService) {
    }

    ngOnInit() {
        this.myObservableSubscription = this.service.allTournaments.subscribe(data => {
            this.allTournaments = data
        })

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

    nominate(tournament: any) {
        const tournamentUpdate = {
            refsConfirmed: JSON.stringify(tournament.refsConfirmed),
            supervisors: JSON.stringify(tournament.supervisors)
        } as Tournament
        this.service.updateTournament(tournament.key, tournamentUpdate)
            .then()
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