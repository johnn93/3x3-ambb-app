import {Component} from '@angular/core';
import {MessageService} from "primeng/api";
import {User} from "../../../interfaces/user";
import {ServiceService} from "../../../shared/service.service";
import {map} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent {
  filterFields: string[] = ['fName', 'lName', 'email', 'phone'];
  visible: boolean = false;
  editMode: boolean = false;
  createNewUser: boolean = false;
  selectedUser: any;
  loading: boolean = false;
  allUsers: any[] = []

  constructor(private messageService: MessageService,
              private service: ServiceService) {
  }

  addUser() {
    this.visible = true;
    this.editMode = false;
    this.createNewUser = true;
  }

  deleteUser(user: any) {
    // this.service.deleteUserFromDataBase(user);
    // this.service.deleteUserFromAuthentication(user);
    // this.messageService.add({severity: 'warn', summary: 'Info', detail: 'Nu se pot sterge useri'})
  }

  openUpdateDialog(user: User) {
    this.selectedUser = user;
    this.editMode = true;
    this.visible = true;
    this.createNewUser = false;
  }

  newHideEvent() {
    this.visible = false;
  }

  newUpdateEvent(event: any) {
    switch (event) {
      case true: {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Arbitru modificat cu succes'
        })
        break;
      }
      default: {
        this.messageService.add({severity: 'error', summary: 'Error', detail: event})
      }
    }
  }

  ngOnInit() {
    this.loading = true;
    this.service.getAllUsers()
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => {
              return {
                key: c.payload.key,
                fName: c.payload.val()?.fName,
                lName: c.payload.val()?.lName,
                email: c.payload.val()?.email,
                phone: c.payload.val()?.phone,
                uid: c.payload.val()?.uid,
                isAdmin: c.payload.val()?.isAdmin,
                scheduledName: c.payload.val()?.scheduledName,
                jersey: c.payload.val()?.jersey,
                shorts: c.payload.val()?.shorts,
              }
            }
          )
        )
      ).subscribe(data => {
      this.allUsers = data.sort((a: any, b: any) => {
        return a.fName?.localeCompare(b.fName!)
      });
      this.loading = false;
    });


  }
}
