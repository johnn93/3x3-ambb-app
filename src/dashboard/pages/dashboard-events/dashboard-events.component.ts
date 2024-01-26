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
    selectedTournament:any;
    loading: boolean = false;
    edit:boolean=false;
    allTournaments: any[] = [];
    filterFields = ['name,city,court,courtNo,period']
    draggedRef: any;
    tournamentKey:string='';
    private myObservableSubscription: Subscription | undefined;

    constructor(private service: ServiceService) {
    }

    ngOnInit() {
        // this.service.getAllTournaments()
        //     .snapshotChanges()
        //     .pipe(
        //         map(changes =>
        //             changes.map(c => {
        //                     return {
        //                         key: c.payload.key,
        //                         name: c.payload.val()?.name,
        //                         period: c.payload.val()?.period.split(','),
        //                         court: c.payload.val()?.court,
        //                         city: c.payload.val()?.city,
        //                         courtNo: c.payload.val()?.courtNo,
        //                         logo: c.payload.val()?.logo,
        //                         link: c.payload.val()?.link,
        //                         refsTotal: JSON.parse(c.payload.val()!.refsTotal),
        //                         refsDeclined: JSON.parse(c.payload.val()!.refsDeclined),
        //                         refsAccepted: JSON.parse(c.payload.val()!.refsAccepted),
        //                         refsConfirmed: JSON.parse(c.payload.val()!.refsConfirmed)
        //                     }
        //                 }
        //             )
        //         )
        //     ).subscribe(data => {
        //     this.allTournaments = data;
        // })
        this.myObservableSubscription = this.service.allTournaments.subscribe(data=>this.allTournaments=data)
    }

    addTournament() {
        this.visible = true;
    }

    hideDialog() {
        this.visible = false;
        this.edit=false;
        this.selectedTournament=null;
    }

    ngOnDestroy(){
        this.myObservableSubscription!.unsubscribe()
}

    deleteTournament(tournament: any) {

    }

    openUpdateDialog(tournament: any) {
        this.selectedTournament = tournament
        this.visible=true;
        this.edit=true;
    }

    dragStart(ref: any,key:string) {
        this.draggedRef = ref;
        this.tournamentKey=key;
    }

    dragEnd() {
        this.draggedRef = null;
    }

    drop(tournamet:any) {
        const selectedTournament = this.allTournaments.filter(tour=>tour.key===tournamet.key)
        if (this.draggedRef && selectedTournament[0].key===this.tournamentKey) {
            const includes:boolean = selectedTournament[0].refsConfirmed.filter((ref:any) => ref?.key === this.draggedRef.key).length > 0
            if (!includes) {
                selectedTournament[0].refsConfirmed.push(this.draggedRef);
            } else {
                this.draggedRef = null;
            }
        }
    }

    nominate(tournament: any) {
        const tournamentUpdate = {
            refsConfirmed: JSON.stringify(tournament.refsConfirmed)
        } as Tournament
        this.service.updateTournament(tournament.key, tournamentUpdate)
            .then()
    }

    onRemove(ref:User,tournament:any) {
        tournament.refsConfirmed.forEach((element:any,index:any)=>{
            if (element.key === ref.key){
                tournament.refsConfirmed.splice(index,1)
            }
        })
    }

    protected readonly formatDate = formatDate;
    protected readonly Date = Date;

    createMokData() {
        for(let i=0;i<100;i++){
            const tournament={
                name: `name + ${i}`,
                period:`Mon Jan 29 2024 00:00:00 GMT+0200 (Eastern European Standard Time),Wed Jan 31 2024 00:00:00 GMT+0200 (Eastern European Standard Time)`,
                court: `period + ${i}`,
                city: `period + ${i}`,
                courtNo: `period + ${i}`,
                logo: 'assets/ambb-logo.png',
                link: `period + ${i}`,
                refsTotal: '[]',
                refsDeclined: '[]',
                refsAccepted: '[]',
                refsConfirmed: '[]'
            } as Tournament
            this.service.createTournament(tournament)
                .then();
        }
    }
}
