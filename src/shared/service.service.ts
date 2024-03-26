import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {User} from "../interfaces/user";
import {Tournament} from "../interfaces/tournament";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {emailApiKey, emailApiUrl} from "./constants";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private usersPath = '/users/';
  private eventsPath = '/events/'
  usersRef: AngularFireList<User>;
  tournamentsRef: AngularFireList<Tournament>;
  apiKey: any;
  apiUrl: any;

  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient) {
    this.usersRef = this.db.list(this.usersPath)
    this.tournamentsRef = this.db.list(this.eventsPath)
    this.apiKey = emailApiKey
    this.apiUrl = emailApiUrl
  }

  getAllUsers(): AngularFireList<User> {
    return this.db.list('users', ref => ref.orderByChild('fName'))
  }

  getUsers(){
    return this.usersRef
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
                shorts: c.payload.val()?.shorts,
                scheduledName: c.payload.val()?.scheduledName,
                isAdmin: c.payload.val()?.isAdmin,
                uid: c.payload.val()!.uid,
                photo: c.payload.val()?.photo,
              }
            }
          )
        )
      )
  }

  getUserByUidTest(uid: any) {
    return this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid).limitToFirst(1))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const userAction = actions[0]; // Assuming only one user matches the query
          return {key: userAction.key, ...userAction.payload.val()!};
        })
      );
  }

  getUserByUid(uid: any) {
    return this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid).limitToFirst(1))
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

  async deleteUser(user:any):Promise<void>{
    try {
      return await this.usersRef.remove(user.key);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async deleteTournament(tournament: any): Promise<void> {
    try {
      return await this.tournamentsRef.remove(tournament.key);
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  }

  sendNominationEmail(senderEmail?: string, bcc?: string[], tournamentName?: string, tournamentDate?: any) {
    const name = tournamentName;
    const date = formatDate(tournamentDate[0], 'dd/MM/yyyy', 'ro-RO') + '-' + formatDate(tournamentDate[1], 'dd/MM/yyyy', 'ro-RO');
    const htmlContent = `<p> Ai fost nominalizat la turneul ${name} din data de ${date}.
        <br>Mai multe detalii poti vedea in aplicatie.
        <br><a href="https://arbitri3x3.baschetbucuresti.ro/">AMBB 3X3 APP</a></p>`
    const subjectContent = `Nominalizari ${name}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    });
    const emailData = {
      sender: {email: senderEmail},
      subject: subjectContent,
      htmlContent: htmlContent,
      params: {
        name: name
      },
      bcc: bcc?.map(email => ({email: email})),
    };
    return this.http.post(this.apiUrl, emailData, {headers})
  }

  sendNewTournamentEmail(senderEmail?: string, bcc?: string[], tournamentName?: string, tournamentDate?: any) {
    const name = tournamentName;
    const date = formatDate(tournamentDate[0], 'dd/MM/yyyy', 'ro-RO') + '-' + formatDate(tournamentDate[1], 'dd/MM/yyyy', 'ro-RO');
    const htmlContent = `<p> Turneul ${name} in perioada ${date} a fost incarcat in aplicatie.
        <br>Te rog sa accesezi aplicatia pentru a iti oferi disponibilitatea la turneu.
        <br><a href="https://arbitri3x3.baschetbucuresti.ro/">AMBB 3X3 APP</a></p>`
    const subjectContent = `Turneu ${name}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    });
    const emailData = {
      sender: {email: senderEmail},
      subject: subjectContent,
      htmlContent: htmlContent,
      params: {
        name: name
      },
      bcc: bcc?.map(email => ({email: email})),
    };
    return this.http.post(this.apiUrl, emailData, {headers})
  }

  sendCanceledTournament(senderEmail?: string, bcc?: string[], tournamentName?: string, tournamentDate?: any) {
    const name = tournamentName;
    const date = formatDate(tournamentDate[0], 'dd/MM/yyyy', 'ro-RO') + '-' + formatDate(tournamentDate[1], 'dd/MM/yyyy', 'ro-RO');
    const htmlContent = `<p> Turneul ${name} din perioada ${date} a fost anulat.</p>`
    const subjectContent = `Turneu anulat`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    });
    const emailData = {
      sender: {email: senderEmail},
      subject: subjectContent,
      htmlContent: htmlContent,
      params: {
        name: name
      },
      bcc: bcc?.map(email => ({email: email})),
    };
    return this.http.post(this.apiUrl, emailData, {headers})
  }

  sendUpdateTournamentEmail(senderEmail?: string, bcc?: string[], tournamentName?: string, tournamentDate?: any) {
    const name = tournamentName;
    const date = formatDate(tournamentDate[0], 'dd/MM/yyyy', 'ro-RO') + '-' + formatDate(tournamentDate[1], 'dd/MM/yyyy', 'ro-RO');
    const htmlContent = `<p> Turneul ${name} a fost modificat.
<br>Va rog sa verificati in aplicatie si sa acceptati sau sa refuzati turneul.</p>`
    const subjectContent = `Turneul ${tournamentName} a fost modificat`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    });
    const emailData = {
      sender: {email: senderEmail},
      subject: subjectContent,
      htmlContent: htmlContent,
      params: {
        name: name
      },
      bcc: bcc?.map(email => ({email: email})),
    };
    return this.http.post(this.apiUrl, emailData, {headers})
  }

  sendCreateAccountEmail(bcc: string[],senderEmail?: string) {
    const htmlContent = `<p> Contul tau a fost creat.
<br>In scurt timp vei primi un email pentru resetarea parolei.
<br>Dupa resetarea parolei vei putea sa te loghezi in contul tau <a href="https://arbitri3x3.baschetbucuresti.ro/">AMBB 3X3 APP</a>.</p>`
    const subjectContent = `Contul tau a fost creat.`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    });
    const emailData = {
      sender: {email: senderEmail},
      subject: subjectContent,
      htmlContent: htmlContent,
      bcc: bcc?.map(email => ({email: email})),
    };
    return this.http.post(this.apiUrl, emailData, {headers})
  }

}
