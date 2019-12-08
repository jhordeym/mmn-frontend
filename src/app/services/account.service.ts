import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as ENV } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';
import { Account } from '../models/Account';
import { ChangePass } from '../models/ChangePass';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  debug = 'true';
  inviteTokenLink = 'http://localhost:4200/signup?inviteToken=';
  recoverLink = 'http://localhost:4200/signup?inviteToken=';

  constructor(private http: HttpClient) {}

  public login(login: Login): Observable<any> {
    return this.http.post<Login>(`${ENV.accountServiceURL}/login`, login);
  }

  public signup(account: Account): Observable<any> {
    return this.http.post<Account>(`${ENV.accountServiceURL}`, {
      account: account,
      link: this.inviteTokenLink
    });
  }

  public forgot(email: string) {
    const changepass = new ChangePass();
    changepass.email = email;
    changepass.link = this.recoverLink;
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(
      `${ENV.accountServiceURL}/forgot`,
      changepass,
      requestOptions
    );
  }

  saveSession(object: any) {
    localStorage.setItem('session', object);
  }

  getSession() {
    return localStorage.getItem('session');
  }

  logout() {
    localStorage.removeItem('session');
  }

  saveRegisterStep(step: number, data: any) {
    localStorage.saveItem('register-step-' + step, data);
  }

  getRegisterStep(step: number) {
    return localStorage.getItem('register-step-' + step);
  }
}
