import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class SorToken {
  public constructor(public token: string, public time: number) {}
}

@Injectable({
  providedIn: 'root'
})
export class SorService {
  headers = new HttpHeaders();
  constructor(private http: HttpClient) {
    this.headers.set('x-saveon-username', 'myTrip53121');
    this.headers.set('x-saveon-secret', 'o2m9je7tdjfrxrys');
  }

  public goTo(cardLink: string) {
    const URL =
      ENV.sorRedirectUrl + this.getToken() + '&RedirectURL=' + cardLink;
    console.log(URL);
    // window.open(URL, '_self');
  }

  sorLogin(): Observable<any> {
    const httpOptions = {
      headers: this.headers
    };
    const apiusername = 'myTrip53121';
    const apipassword = 'o2m9je7tdjfrxrys';
    const email = 'test1@gmail.com';
    const accountId = '7cd3db97-2f59-46f6-a91a-7812d40273a8';
    return this.http.post<any>(
      ENV.sorApiUrl + '/getlogintokennovalidation',
      {
        APIUsername: apiusername,
        APIPassword: apipassword,
        Email: email,
        ContractNumber: accountId
      },
      httpOptions
    );
  }

  getToken() {
    let token: SorToken = this.getLSToken();
    if (token && this.validateTime(token.time)) {
      return token;
    } else {
      return this.sorLogin().subscribe(
        (data: string) => {
          if (data.startsWith('LoginToken')) {
            const newToken = data.split(':')[0];
            console.log(newToken);
            this.saveLSToken(newToken);
            return newToken;
          }
        },
        error => console.log(error)
      );
    }
  }

  validateTime(time: number) {
    // less than 10 min?
    return new Date().getTime() - time < 600000;
  }

  saveLSToken(token: string) {
    let currentTime: number = new Date().getTime();
    const sorToken = new SorToken(token, currentTime);

    localStorage.setItem('sor-token', JSON.stringify(sorToken));
  }

  getLSToken(): SorToken {
    const token: string = localStorage.getItem('sor-token');
    if (!token) return null;
    return JSON.parse(token);
  }
}
