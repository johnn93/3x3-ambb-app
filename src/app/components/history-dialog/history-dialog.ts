import { Component } from '@angular/core';
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.html',
  styleUrls: ['./history-dialog.scss']
})
export class HistoryDialog {

  protected readonly formatDate = formatDate;

    tournament:any;

    constructor(private config:DynamicDialogConfig) {
        this.tournament=this.config.data.tournaments
    }
}
