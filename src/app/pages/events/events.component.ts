import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {map, Observable, Subscription} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent {

    startIndex: number = 0;
    sum = 15;
    allTournaments: any[] = [];
    tournaments: any[] = []
    tournament: any;
    subscription: Subscription | undefined
    loading:boolean=false;

    constructor(private service: ServiceService) {
    }

    ngOnInit() {
        this.getTournaments()
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe()
    }

    protected readonly formatDate = formatDate;

    onScroll() {
        if(this.sum<=this.allTournaments.length){
            this.startIndex = this.sum
            this.sum += 1
            this.getTournaments()
        }
    }

    addItems(index: number, sum: number) {
        for (let i = index; i < sum; ++i) {
            if (i < this.allTournaments.length)
                this.tournaments.push(this.allTournaments[i]);
        }
    }

    getTournaments() {
        this.subscription = this.service.allTournaments.subscribe(data => {
            this.allTournaments = data;
            this.addItems(this.startIndex, this.sum)
        })
    }
}
