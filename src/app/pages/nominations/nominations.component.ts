import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {combineLatest} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-nominations',
  templateUrl: './nominations.component.html',
  styleUrls: ['./nominations.component.scss']
})
export class NominationsComponent {
  protected readonly formatDate = formatDate;
  allTournaments: any[] = []
  tournaments: any[] = []
  tournament: any;
  profile: any;
  loading: boolean = false;

  constructor(private service: ServiceService) {
  }

  ngOnInit() {
    this.getTournaments()
  }

  getTournaments() {
    this.loading = true;
    const tournamentObservable = this.service.getTournaments()
    const userObservable = this.service.getUsers()
    combineLatest({
      tournaments: tournamentObservable,
      users: userObservable
    })
      .subscribe(result => {
        const tournaments = result.tournaments;
        const users = result.users;
        const tournamentsWithRefsTotal = tournaments.map(tournament => {
          const refsConfirmed = tournament.refsConfirmed.map((refUid: any) => users.find(user => user.uid === refUid.uid));
          const supervisors = tournament.supervisors.map((refUid: any) => users.find(user => user.uid === refUid.uid));
          return {...tournament, refsConfirmed, supervisors};
        })
        tournamentsWithRefsTotal.sort((a: any, b: any): any => {
          let date1 = new Date(a.period[0])
          let date2 = new Date(b.period[0])
          // @ts-ignore
          return date1 - date2
        })
        const futureTournaments = tournamentsWithRefsTotal.filter(data => new Date(data.period[0]) > new Date());
        futureTournaments.forEach(tournament => {
          tournament.refsConfirmed.forEach((ref: any) => {
            if (ref.uid === localStorage.getItem('uid')) {
              this.allTournaments.push(tournament)
            }
          })
        })
        this.loading = false;
      })
  }
}
