import { Component } from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {formatDate} from "@angular/common";
import {DialogService} from "primeng/dynamicdialog";
import {TournamentsNominations} from "../../components/tournaments-nominations/tournaments-nominations";
import {HistoryDialog} from "../../components/history-dialog/history-dialog";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
    providers:[DialogService]
})
export class HistoryComponent {

    allTournaments:any;
    years:any[]=[];
    personalYears:any[]=[];
    personalHistory:any[]=[];
    allHistory:any[]=[];
    
    
    constructor(private service:ServiceService,
                private dialog:DialogService) {
    }
    
    ngOnInit(){
        this.service.historyTournaments.subscribe(data=>{
            this.allTournaments=data
            this.addYears(this.allTournaments)
            this.addPersonalYears(this.allTournaments)
        })
    }

    addPersonalYears(tournaments:any){
        tournaments.forEach((tournament:any)=>{
            let year = new Date(tournament.period[0]).getFullYear().toString()
            let endDate = new Date(tournament.period[1])
            console.log(year)
            tournament.refsConfirmed.forEach((ref:any)=>{
                if('12'===ref.key){
                    if(!this.personalYears.includes(year) && endDate<new Date()){
                        this.personalYears.push(year);
                        console.log(this.personalYears)
                    }
                    if(endDate<new Date()){
                        this.personalHistory.push({year:year,tournaments:tournament})
                    }
                    console.log(this.personalHistory)
                }
            })
        })
    }

    addYears(tournaments:any){
        tournaments.forEach((tournament:any)=>{
            let year = new Date(tournament.period[0]).getFullYear().toString()
            if(new Date(tournament.period[1])<new Date()){
                this.allHistory.push({year:year,tournaments:tournament})
            }
            if(!this.years.includes(year) && new Date(tournament.period[1])<new Date()){
                this.years.push(year);
            }
        })
    }

    protected readonly formatDate = formatDate;

    openDialog(tournament: any) {
        this.dialog.open(HistoryDialog,{data:tournament})
    }
}
