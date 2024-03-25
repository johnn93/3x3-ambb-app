import {Component} from '@angular/core';
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.html',
  styleUrls: ['./history-dialog.scss']
})
export class HistoryDialog {
  defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
  protected readonly formatDate = formatDate;
  tournament: any;

  constructor(private config: DynamicDialogConfig) {
    this.tournament = this.config.data.tournaments
  }
}
