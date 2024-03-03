import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {formatDate} from "@angular/common";
import {DialogService} from "primeng/dynamicdialog";
import {HistoryDialog} from "../../components/history-dialog/history-dialog";
import {MessageService} from "primeng/api";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [DialogService, MessageService]
})
export class HistoryComponent {

  allTournaments: any;
  years: any[] = [];
  personalYears: any[] = [];
  personalHistory: any[] = [];
  allHistory: any[] = [];
  profile: any;
  loading: boolean = false;

  constructor(private service: ServiceService,
              private dialog: DialogService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loading = true;
    this.service.getHistory().subscribe(data => {
      data.sort((a: any, b: any): any => {
        let date1 = new Date(a.period[0])
        let date2 = new Date(b.period[0])
        // @ts-ignore
        return date1 - date2
      })
      this.allTournaments = data
      this.service
        .getUserByUid(localStorage.getItem('uid'))
        .valueChanges()
        .subscribe(data => {
          this.profile = data[0];
          this.addYears(this.allTournaments)
          this.addPersonalYears(this.allTournaments)
          this.loading = false;
        })
    })
  }

  checkIfRef(tournament: any) {
    return tournament.find((ref: any) => ref?.uid === this.profile?.uid)
  }

  checkIfTournament(tournament: any) {
    return tournament.find((key: any) => key === tournament.key)
  }

  addPersonalYears(tournaments: any) {
    console.log(tournaments)
    tournaments.find((tournament: any) => {
      if(this.checkIfRef(tournament.refsConfirmed)){
        let year = new Date(tournament.period[0]).getFullYear().toString()
        let endDate = new Date(tournament.period[1])
        // if (this.checkIfRef(tournament)) {
          if (!this.personalYears.includes(year) && endDate < new Date()) {
            this.personalYears.push(year);
          }
          if (endDate < new Date()) {
            this.personalHistory.push({year: year, tournaments: tournament})
          }
        // }
      }

    })
  }

  addYears(tournaments: any) {
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

  protected readonly formatDate = formatDate;

  openDialog(tournament: any) {
    this.dialog.open(HistoryDialog, {data: tournament})
  }
}
