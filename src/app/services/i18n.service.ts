import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as ENV } from 'src/environments/environment';
import { I18nDto } from '../models/translation/i18nDto';
import { I18nData } from '../models/translation/i18nData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private http: HttpClient) {}

  public allDto(): Observable<Array<I18nDto>> {
    return this.http
      .get<Array<I18nDto>>(`${ENV.languagePackServiceURL}`);
  }

  public by(lang: string): Observable<I18nDto> {
    return this.http
      .get<I18nDto>(`${ENV.languagePackServiceURL}/${lang}`);
  }

  public saveOne(lang: I18nData): Observable<I18nData> {
    return this.http
      .get<I18nData>(`${ENV.languagePackServiceURL}/one`);
  }

  public saveMany(lang: I18nDto): Observable<Array<I18nData>> {
    return this.http
      .get<Array<I18nData>>(`${ENV.languagePackServiceURL}/many`);
  }

  public deleteOne(lang: I18nData): Observable<string> {
    return this.http
      .get<string>(`${ENV.languagePackServiceURL}/one`);
  }

  public deleteMany(lang: I18nDto): Observable<Array<string>> {
    return this.http
      .get<Array<string>>(`${ENV.languagePackServiceURL}/many`);
  }
}
