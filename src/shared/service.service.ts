import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {User} from "../interfaces/user";
import {Tournament} from "../interfaces/tournament";
import {BehaviorSubject, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private usersPath = '/users/';
  private eventsPath = '/events/'
  usersRef: AngularFireList<User>;
  tournamentsRef: AngularFireList<Tournament>;
  allTournaments: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  historyTournaments: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor(
    private db: AngularFireDatabase,) {
    this.usersRef = this.db.list(this.usersPath)
    this.tournamentsRef = this.db.list(this.eventsPath)
    this.getTournaments()
    this.getHistory()
  }

  getAllUsers(): AngularFireList<User> {
    return this.db.list('users', ref => ref.orderByChild('fName'))
  }

  getUserByUid(uid: any) {
    return this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid))
  }

  getTournaments() {
    return this.getAllTournaments()
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
                refsTotal: c.payload.val()!.refsTotal ? JSON.parse(c.payload.val()!.refsTotal) : [],
                refsDeclined: c.payload.val()!.refsDeclined ? JSON.parse(c.payload.val()!.refsDeclined) : [],
                refsAccepted: c.payload.val()!.refsAccepted ? JSON.parse(c.payload.val()!.refsAccepted) : [],
                refsConfirmed: c.payload.val()!.refsConfirmed ? JSON.parse(c.payload.val()!.refsConfirmed) : [],
                supervisors: c.payload.val()!.supervisors ? JSON.parse(c.payload.val()!.supervisors) : []
              }
            }
          )
        )
      )
  }

  getHistory() {
    return this.getAllTournaments()
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
                refsConfirmed: JSON.parse(c.payload.val()!.refsConfirmed),
                supervisors: JSON.parse(c.payload.val()!.supervisors)
              }
            }
          )
        )
      )
      .subscribe(data => {
        data.sort((a: any, b: any): any => {
          let date1 = new Date(a.period[0])
          let date2 = new Date(b.period[0])
          // @ts-ignore
          return date1 - date2
        })
        this.historyTournaments.next(data);
      })
  }

  getAllTournaments(): AngularFireList<any> {
    return this.tournamentsRef
  }

  createUser(user: User) {
    return this.usersRef.push(user);
  }

  createTournament(tournament: Tournament) {
    return this.tournamentsRef.push(tournament);
  }

  updateTournament(key: string, value: any) {
    return this.tournamentsRef.update(key, value);
  }

  updateUser(key: string, value: any): Promise<void> {
    return this.usersRef.update(key, value);
  }
}
