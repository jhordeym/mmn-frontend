import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment as ENV } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { I18nData } from '../models/translation/i18nData';
import { I18nService } from '../services/i18n.service';
import { I18nDto } from '../models/translation/i18nDto';

@Injectable()
export class I18NServiceProvider {
  languagePackLoaded = 'en';

  constructor(
    public http: HttpClient,
    private translateService: TranslateService,
    private i18nService: I18nService
  ) {}

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
      this.loadI18nLanguagePack(lang).subscribe(
        (data) => {
          this.languagePackLoaded = lang;
          resolve(data.dictionary);
        },
        error => {
          /* retry with mock */
          this.loadI18nLanguagePackFromMock(lang).subscribe(
            mockData => {
              this.languagePackLoaded = lang;
              console.log(
                `Error trying to get the language pack for the language "${lang}" from the server => fallback to mock.`
              );
              resolve(mockData);
            },
            mockError => {
              console.log(
                `Error trying to get the language pack for the language "${lang}" from the server and from mock.`
              );
              reject(mockError);
            }
          );
        }
      );
    });
  }

  private loadI18nLanguagePack(lang: string): Observable<any> {
    console.log('loading lang pack ' + lang + ' from server');
    return this.i18nService.by(lang);
  }

  private loadI18nLanguagePackFromMock(lang: string): Observable<any> {
    console.log('loading lang pack ' + lang + ' from mock');
    return this.http.get<any>(`assets/i18n/${lang}.json`);
  }
}
