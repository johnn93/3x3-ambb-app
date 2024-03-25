import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-tournaments-nominations',
  templateUrl: './tournaments-nominations.html',
  styleUrls: ['./tournaments-nominations.scss'],
})
export class TournamentsNominations {

  @Input() tournaments: any;
  protected readonly formatDate = formatDate;
  defaultAvatar='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
}
