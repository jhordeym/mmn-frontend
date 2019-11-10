import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18NServiceProvider } from './providers/i18n-service.provider';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  smallLogo = ENV.imageLogoSmall;
  supportedLangs = ['en', 'pt'];
  supportedLangsFlags = {
    en: 'flag-icon flag-icon-us',
    pt: 'flag-icon flag-icon-br'
  };

  currentLang = this.supportedLangs[0];
  currentLangFlag = this.supportedLangsFlags[0];

  constructor(
    private translate: TranslateService,
    private i18NServiceProvider: I18NServiceProvider
    ) {
      this.setDefaultLang();
  }

  setDefaultLang() {
    this.translate.setDefaultLang(this.currentLang);
    const browserLang = this.translate.getBrowserLang();
    if (this.supportedLangs.includes(browserLang)) {
      this.currentLang = browserLang;
      this.currentLangFlag = this.supportedLangs[this.currentLang];
    }
    this.setLang(this.currentLang);
  }

  setLang(lang: string) {
    this.currentLang = lang;
    this.currentLangFlag = this.supportedLangs[this.currentLang];
    this.i18NServiceProvider.getLanguagePack(lang)
    .then(languagePack => {
      this.translate.setTranslation(this.i18NServiceProvider.currentLanguagePackLoaded, languagePack);
      this.translate.use(this.i18NServiceProvider.currentLanguagePackLoaded);
      console.log(`Language Pack loaded from API was "${this.i18NServiceProvider.currentLanguagePackLoaded}"`);
    }).catch(error => {
      console.error(`Language Pack can not be loaded from API. Error ${error}`);
    });
  }
}
