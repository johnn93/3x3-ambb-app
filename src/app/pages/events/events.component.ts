import { Component } from '@angular/core';
import {ServiceService} from "../../../shared/service.service";
import {map} from "rxjs";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

    allTournaments:any;

    constructor(private service:ServiceService) {}

    ngOnInit(){
        this.service.getAllTournaments()
            .snapshotChanges()
            .pipe(
                map(changes =>
                    changes.map(c => {
                            return {
                                key: c.payload.key,
                                name: c.payload.val()?.name,
                                period: c.payload.val()?.period.split(','),
                                court: c.payload.val()?.court,
                                city: c.payload.val()?.city,
                                courtNo: c.payload.val()?.courtNo,
                                logo: c.payload.val()?.logo,
                                link: c.payload.val()?.link,
                                refsTotal: JSON.parse(c.payload.val()!.refsTotal),
                                refsDeclined: JSON.parse(c.payload.val()!.refsDeclined),
                                refsAccepted: JSON.parse(c.payload.val()!.refsAccepted),
                                refsConfirmed: JSON.parse(c.payload.val()!.refsConfirmed)
                            }
                        }
                    )
                )
            ).subscribe(data => {
            this.allTournaments = data;
        })

    }

    protected readonly formatDate = formatDate;
}
