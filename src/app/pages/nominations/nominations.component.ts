import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {map, Subscriber, Subscription} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-nominations',
    templateUrl: './nominations.component.html',
    styleUrls: ['./nominations.component.scss']
})
export class NominationsComponent {
    startIndex: number = 0;
    sum = 15;
    allTournaments: any
    tournaments: any[] = []
    tournament: any;
    protected readonly formatDate = formatDate;
    subscription:Subscription | undefined

    constructor(private service: ServiceService) {
    }

    ngOnInit() {
        this.getTournaments()
    }

    ngOnDestroy(){
        this.subscription?.unsubscribe()
    }

    getTournaments() {
        this.subscription=this.service.allTournaments.subscribe(data => {
            this.allTournaments = data;
            this.addItems(this.startIndex, this.sum)
        })
    }


    addItems(index: number, sum: number) {
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
