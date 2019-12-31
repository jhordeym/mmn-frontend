import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SorLoginToken } from '../models/sor/SorLoginToken';
import { Account } from '../models/Account';
import { SorAccount } from '../models/sor/SorAccount';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { SorResponse } from '../models/sor/SorResponse';

@Injectable({
  providedIn: 'root'
})
export class SorService {

  createErrorMsgs = ["An error has occurred.", "A user with email admin@travined.com is already a member of this club."];
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  }

  getCountriesList() {
    return i18nIsoCountries.getNames("en");
  }

  // BACKEND SERVICE
  public sorCreate(subscriptionId: string, account: Account, referalId: string, password: string): Observable<SorResponse>{
    let headers = new HttpHeaders();
    headers = headers.set('subscriptionId', subscriptionId);
    const httpOptions = {
      headers: headers
    };

    const body = new SorAccount(
      account.email, account.id, password, account.name, account.lastName,
      account.address.street, account.address.city, 'PT', account.phone, '9', referalId
    )
    console.log(body, httpOptions);
    return this.http.post<SorResponse>(
      ENV.reservationServiceURL + '/create',
      body,
      httpOptions
    );
  }

  public sorLoginToken(subscriptionId: string, account: Account): Observable<SorLoginToken> {
    let headers = new HttpHeaders();
    headers = headers.set('subscriptionId', subscriptionId);
    const httpOptions = {
      headers: headers
    };

    const body = {
      Email: account.email,
      ContractNumber: account.id
    };
    console.log(body, httpOptions);
    return this.http.post<SorLoginToken>(
      ENV.reservationServiceURL + '/login',
      body,
      httpOptions
    );
  }

  //
  public fetchTokenAndNavigate(subscriptionId: string, account: Account, cardLink: string): Promise<any> {
    let token: SorLoginToken = this.getCachedToken();
    return new Promise((resolve, reject) => {
      if (token && this.validateToken(token)) {
        this.navigate(token.token, cardLink);
        resolve('success');
      } else {
        this.sorLoginToken(subscriptionId, account).subscribe(
          (data: SorLoginToken) => {
            if (data) {
              console.log(data);
              this.saveTokenOnCache(data);
              resolve('success');
              this.navigate(data.token, cardLink);
            }
          },
          error => {
            reject(error);
            console.log(error)
          }
        );
      }
    });
  }

  private navigate(token: string, cardLink: string): void {
    const URL = ENV.sorRedirectUrl + token + '&RedirectURL=' + cardLink;
    console.log(URL);
    window.open(URL, '_blank');
  }

  private validateToken(token: SorLoginToken): boolean {
    // less than 10 min?
    return token.generateTimeMilis < token.expireTimeMilis;
  }

  // CACHE
  saveTokenOnCache(token: SorLoginToken): void {
    localStorage.setItem('sor-token', JSON.stringify(token));
  }

  getCachedToken(): SorLoginToken {
    const token: string = localStorage.getItem('sor-token');
    if (!token) return null;
    return JSON.parse(token);
  }
}
