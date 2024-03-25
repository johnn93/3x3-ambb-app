import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {formatDate} from "@angular/common";
import {DialogService} from "primeng/dynamicdialog";
import {HistoryDialog} from "../../components/history-dialog/history-dialog";
import {MessageService} from "primeng/api";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [DialogService, MessageService]
})
export class HistoryComponent {
  protected readonly formatDate = formatDate;
  allTournaments: any;
  years: any[] = [];
  personalYears: any[] = [];
  personalHistory: any[] = [];
  allHistory: any[] = [];
  profile: any;
  loading: boolean = false;

  constructor(private service: ServiceService,
              private dialog: DialogService) {
  }

  ngOnInit() {
    const historyObservable = this.service.getHistory()
    const userObservable = this.service.getUsers()
    combineLatest({
      history: historyObservable,
      users: userObservable
    })
      .subscribe(result => {
        const tournaments = result.history;
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
        this.allTournaments=tournamentsWithRefsTotal.filter(data => new Date(data.period[0]) < new Date());
        this.addYears(this.allTournaments)
        this.addPersonalYears(this.allTournaments)
        this.loading = false;
      })
  }

  // this.loading = true;
  // this.service.getHistory().subscribe(data => {
  //   data.sort((a: any, b: any): any => {
  //     let date1 = new Date(a.period[0])
  //     let date2 = new Date(b.period[0])
  //     // @ts-ignore
  //     return date1 - date2
  //   })
  //   this.allTournaments = data
  //   this.service
  //     .getUserByUid(localStorage.getItem('uid'))
  //     .valueChanges()
  //     .subscribe(data => {
  //       this.profile = data[0];
  //       this.addYears(this.allTournaments)
  //       this.addPersonalYears(this.allTournaments)
  //       this.loading = false;
  //     })
  // })
  // }

  checkIfRef(tournament: any) {
    return tournament.find((ref: any) => ref?.uid === this.profile?.uid)
  }

  addPersonalYears(tournaments: any) {
    tournaments.find((tournament: any) => {
      if (this.checkIfRef(tournament.refsConfirmed)) {
        let year = new Date(tournament.period[0]).getFullYear().toString()
        let endDate = new Date(tournament.period[1])
        if (!this.personalYears.includes(year) && endDate < new Date()) {
          this.personalYears.push(year);
        }
        if (endDate < new Date()) {
          this.personalHistory.push({year: year, tournaments: tournament})
        }
      }

    })
  }

  addYears(tournaments: any) {
    console.log(tournaments)
    tournaments.forEach((tournament: any) => {
      let year = new Date(tournament.period[0]).getFullYear().toString()
      if (new Date(tournament.period[1]) < new Date()) {
        this.allHistory.push({year: year, tournaments: tournament})
      }
      if (!this.years.includes(year) && new Date(tournament.period[1]) < new Date()) {
        this.years.push(year);
      }
    })
  }

  openDialog(tournament: any) {
    this.dialog.open(HistoryDialog, {data: tournament})
  }
}
