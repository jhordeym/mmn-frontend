import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SorLoginToken } from '../models/sor/SorLoginToken';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class SorService {
  headers = new HttpHeaders();
  constructor(private http: HttpClient) {}

  // BACKEND SERVICE
  sorLoginToken(account: Account): Observable<SorLoginToken> {
    let headers = new HttpHeaders();
    headers = headers.set('subscriptionId', '0');
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

  public fetchTokenAndNavigate(account: Account, cardLink: string): Promise<any> {
    let token: SorLoginToken = this.getCachedToken();
    return new Promise((resolve, reject) => {
      if (token && this.validateToken(token)) {
        this.navigate(token.token, cardLink);
        resolve('success');
      } else {
        this.sorLoginToken(account).subscribe(
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
