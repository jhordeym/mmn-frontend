import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { I18NData } from '../models/I18NData';

@Injectable()
export class I18NServiceProvider {

  languagePackLoaded = 'en';
  useMock = true;

  constructor(
    public http: HttpClient,
    private translateService: TranslateService
  ) { }

  public getTranslation(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.translateService.get(key).subscribe(
        translated => resolve(translated),
        error => reject(error)
      );
    });
  }

  public get currentLanguagePackLoaded() {
    return this.languagePackLoaded;
  }

  public getLanguagePack(lang: string): Promise<JSON> {
      return new Promise((resolve, reject) => {
        this.conditionalLoadPack(lang).subscribe(
          (data: I18NData) => {
            /* debug */
            // console.log(data);
            this.languagePackLoaded = data.locale;
            resolve(data.dictionary);
          },
          error => {
            console.log(`Error trying to get the language pack for the language "${lang}" from the server.`);
            reject(error);
          }
        );
      });
  }

  private conditionalLoadPack(lang: string): Observable<any> {
    return this.useMock
    ? this.loadI18nLanguagePackFromMock(lang)
    : this.loadI18nLanguagePack(lang);
  }

  private loadI18nLanguagePack(lang: string): Observable<any> {
    return this.http.get<any>(`${environment.languagePackServiceURL}/${lang}`);
  }

   private loadI18nLanguagePackFromMock(lang: string): Observable<any> {
     return this.http.get<any>(`assets/i18n/${lang}.json`);
   }
}
