import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SorLoginToken } from '../models/sor/SorLoginToken';

@Injectable({
  providedIn: 'root'
})
export class SorService {
  headers = new HttpHeaders();
  constructor(private http: HttpClient) {}

  // BACKEND SERVICE
  sorLoginToken(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('subscriptionId', '0');
    const httpOptions = {
      headers: headers
    };

    const email = 'test1@gmail.com';
    const accountId = '7cd3db97-2f59-46f6-a91a-7812d40273a8';
    const body = {
      Email: email,
      ContractNumber: accountId
    };
    console.log(body, httpOptions);
    return this.http.post<any>(
      ENV.reservationServiceURL + '/login',
      body,
      httpOptions
    );
  }

  fetchTokenAndNavigate(cardLink): void {
    let token: SorLoginToken = this.getCachedToken();
    if (token && this.validateToken(token)) {
      this.navigate(token.token, cardLink);
    } else {
      this.sorLoginToken().subscribe(
        (data: SorLoginToken) => {
          if (data) {
            console.log(data);
            this.saveTokenOnCache(data);
            this.navigate(data.token, cardLink);
          }
        },
        error => console.log(error)
      );
    }
  }

  private navigate(token, cardLink): void {
    const URL = ENV.sorRedirectUrl + token + '&RedirectURL=' + cardLink;
    console.log(URL);
    window.open(URL, '_blank');
  }

  private validateToken(token: SorLoginToken): boolean {
    // less than 10 min?
    return token.generateTimeMilis < token.expireTimeMilis;
  }

  // CACHE
  saveTokenOnCache(token: SorLoginToken) {
    localStorage.setItem('sor-token', JSON.stringify(token));
  }

  getCachedToken(): SorLoginToken {
    const token: string = localStorage.getItem('sor-token');
    if (!token) return null;
    return JSON.parse(token);
  }
}
