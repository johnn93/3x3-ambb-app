import {Component, EventEmitter, Input, Output} from '@angular/core';
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-tournaments-nominations',
  templateUrl: './tournaments-nominations.html',
  styleUrls: ['./tournaments-nominations.scss'],
})
export class TournamentsNominations {

    @Input() tournaments:any;
    @Output() newScroll:EventEmitter<any> = new EventEmitter<any>()
    protected readonly formatDate = formatDate;

    onScroll(){
        this.newScroll.emit()
    }

}
