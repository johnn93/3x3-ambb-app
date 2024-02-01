import {Component} from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {map, Observable, Subscription} from "rxjs";
import {formatDate} from "@angular/common";
import {Tournament} from "../../../interfaces/tournament";

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
        if(this.tournaments.length===this.allTournaments.length){
            return;
        }
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

    available(tournament:Tournament) {
        console.log(tournament)
        let total =[...tournament.refsTotal]
        let accepted = [...tournament.refsAccepted]
         total.forEach((ref:any,index:number)=>{
             if('12'===ref.key){
                 console.log(index)
                 accepted = total.splice(index,1)
             }
             else {
                 return
             }
         })
        this.service.updateTournament(tournament.key,{refsTotal:JSON.stringify(total),refsAccepted:JSON.stringify(accepted)})
            .then(()=>this.getTournaments());
    }

    declined(tournament:Tournament) {
        let total =[...tournament.refsTotal]
        let declined = [...tournament.refsDeclined]
        total.forEach((ref:any,index:number)=>{
            if('12'===ref.key){
                console.log(index)
                declined = total.splice(index,1)
            }
            else {
                return
            }
        })
        this.service.updateTournament(tournament.key,{refsTotal:JSON.stringify(total),refsDeclined:JSON.stringify(declined)})
            .then(()=>this.getTournaments());
    }

    checkIfAccepted(tournament:Tournament):boolean{
        let accepted = [...tournament.refsAccepted]
        let acc = false
        accepted.forEach((ref:any)=>{
           acc=true
        })
        return acc;
    }

    checkIfDeclined(tournament:Tournament):boolean{
        let declined = [...tournament.refsDeclined]
        let acc = false
        declined.forEach((ref:any)=>{
            acc=true
        })
        return acc;
    }

}
