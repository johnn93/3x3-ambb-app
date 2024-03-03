import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {Subscription} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-nominations',
  templateUrl: './nominations.component.html',
  styleUrls: ['./nominations.component.scss']
})
export class NominationsComponent {
  protected readonly formatDate = formatDate;
  startIndex: number = 0;
  sum = 15;
  allTournaments: any[] = []
  tournaments: any[] = []
  tournament: any;
  subscription: Subscription | undefined
  profile: any;
  loading: boolean = false;

  constructor(private service: ServiceService) {
  }

  ngOnInit() {
    this.getTournaments()
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

  getTournaments() {
    this.loading=true;
    this.subscription = this.service.getTournaments().subscribe(data => {
      data.sort((a: any, b: any): any => {
        let date1 = new Date(a.period[0])
        let date2 = new Date(b.period[0])
        // @ts-ignore
        return date1 - date2
      })
      this.service.getUserByUid(localStorage.getItem('uid'))
        .valueChanges()
        .subscribe(profile => {
          this.profile = profile[0];
          data.forEach(tournament => {
            tournament.refsConfirmed.forEach((ref: any) => {
              if (ref.uid === this.profile.uid && new Date(tournament.period[0]) > new Date()) {
                this.allTournaments.push(tournament)
              }
            })
          })
          this.addItems(this.startIndex, this.sum)
          this.loading=false;
        })
    })
  }

  addItems(index: number, sum: number) {
    if (this.tournaments.length === this.allTournaments.length) {
      return
    }
    if (this.allTournaments.length) {
      for (let i = index; i < sum; ++i) {
        if (i < this.allTournaments.length)
          this.tournaments.push(this.allTournaments[i]);
      }
    }

  }

  onScroll() {
    if (this.sum <= this.allTournaments.length) {
      this.startIndex = this.sum
      this.sum += 1
      this.getTournaments()
    }
  }
}
