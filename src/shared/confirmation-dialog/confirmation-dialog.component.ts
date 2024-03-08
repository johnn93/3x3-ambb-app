import {Component, Input} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ConfirmationDialogComponent {

  data:any
  message:string=''
  constructor(public dialogRef: DynamicDialogRef,
              public dialogConfig: DynamicDialogConfig) {
    this.data=dialogConfig.data.tournament
    this.message=dialogConfig.data.message
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
