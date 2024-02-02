import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from "@angular/fire/compat/database";
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
    allTournaments:BehaviorSubject<any[]>=new BehaviorSubject<any[]>([])
    historyTournaments:BehaviorSubject<any[]>=new BehaviorSubject<any[]>([])
    allUsers:BehaviorSubject<any[]>=new BehaviorSubject<any[]>([])

    constructor(
                private db: AngularFireDatabase,) {
        this.usersRef = this.db.list(this.usersPath)
        this.tournamentsRef = this.db.list(this.eventsPath)
        this.getTournaments()
        this.getHistory()
        this.getUsers()
    }

    getAllUsers(): AngularFireList<User> {
        return this.usersRef;
    }

    getUsers(){
        this.getAllUsers()
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
                                scheduleName: c.payload.val()?.scheduledName,
                                jersey: c.payload.val()?.jersey,
                                shorts: c.payload.val()?.shorts,
                            }
                        }
                    )
                )
            ).subscribe(data => {
            data.sort((a: any, b: any) => {
                return a.fName?.localeCompare(b.fName!)
            });
            this.allUsers.next(data)
        });
    }

    getUserByUid(uid: any) {
        let userFound={}
        return this.usersRef
            .snapshotChanges()
            .pipe(map(changes =>
                    // @ts-ignore
                    changes.map(user => {
                            if (uid === user.payload.val()?.uid){
                                userFound = {
                                    fName: user.payload.val()!.fName,
                                    lName: user.payload.val()!.lName,
                                    email: user.payload.val()!.email,
                                    phone: user.payload.val()!.phone,
                                    isAdmin: user.payload.val()!.isAdmin,
                                    uid: user.payload.val()!.uid,
                                    scheduleName: user.payload.val()!.scheduledName,
                                    key: user.payload.key,
                                    jersey: user.payload.val()!.jersey,
                                    shorts: user.payload.val()!.shorts,
                                }
                                return userFound
                            }

                        }
                    )
                )
            )
    }

    getTournaments(){
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
                                refsTotal: JSON.parse(c.payload.val()!.refsTotal),
                                refsDeclined: JSON.parse(c.payload.val()!.refsDeclined),
                                refsAccepted: JSON.parse(c.payload.val()!.refsAccepted),
                                refsConfirmed: JSON.parse(c.payload.val()!.refsConfirmed),
                                supervisors: JSON.parse(c.payload.val()!.supervisors)
                            }
                        }
                    )
                )
            )
           .subscribe(data => {
                data.sort((a:any,b:any):any=> {
                    let date1=new Date(a.period[0])
                    let date2 = new Date(b.period[0])
                    // @ts-ignore
                    return date1 - date2
                })
            this.allTournaments.next(data);
        })
    }

    getHistory(){
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
                data.sort((a:any,b:any):any=> {
                    let date1=new Date(a.period[0])
                    let date2 = new Date(b.period[0])
                    // @ts-ignore
                    return date1 - date2
                })
                this.historyTournaments.next(data);
            })
    }

    getAllTournaments():AngularFireList<any>  {
        return this.tournamentsRef
    }

    createUser(user: User) {
        return this.usersRef.push(user);
    }

    createTournament(tournament: Tournament) {
        return this.tournamentsRef.push(tournament);
    }

    updateTournament(key:string,value:any) {
        return this.tournamentsRef.update(key,value);
    }

    updateUser(key: string, value: any): Promise<void> {
        return this.usersRef.update(key, value);
    }
}
