import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';
import { Account } from '../models/Account';
import { ChangePass } from '../models/ChangePass';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  debug = 'true';

  constructor(private http: HttpClient, private router: Router) {}

  public login(login: Login): Observable<Account | any> {
    return this.http.post<Login>(`${ENV.accountServiceURL}/login`, login);
  }

  public listAll(): Observable<Array<Account> | any> {
    return this.http.get<Array<Account>>(`${ENV.accountServiceURL}`);
  }

  public signup(account: Account): Observable<Account | any> {
    return this.http.post<Account>(`${ENV.accountServiceURL}`, {
      account: account,
      link: ENV.inviteTokenLink
    });
  }

  public exists(account: Account): Observable<any> {
    return this.http.post<any>(`${ENV.accountServiceURL}`, account);
  }

  public verifyInviteToken(token: string): Promise<string> {
    return this.http
      .post(
        `${ENV.accountServiceURL}/invite/verify-token`,
        {
          inviteToken: token
        },
        {
          responseType: 'text'
        }
      )
      .toPromise();
  }

  public forgot(email: string) {
    const changepass = new ChangePass();
    changepass.email = email;
    changepass.link = ENV.recoverLink;
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(
      `${ENV.accountServiceURL}/forgot`,
      changepass,
      requestOptions
    );
  }

  // CACHE
  saveSession(account: Account): void {
    localStorage.setItem('session', JSON.stringify(account));
  }

  getSession(): Account {
    const account: string = localStorage.getItem('session');
    if (!account) return null;
    return JSON.parse(account);
  }

  logout() {
    localStorage.removeItem('session');
  }

  saveRegisterStep(step: number, data: any) {
    localStorage.setItem(`register-step-${step}`, JSON.stringify(data));
  }

  getRegisterStep(step: number) {
    const data = localStorage.getItem(`register-step-${step}`);
    if (!data) return null;
    return JSON.parse(data);
  }
}
