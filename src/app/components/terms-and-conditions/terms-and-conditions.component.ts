import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18NServiceProvider } from 'src/app/providers/i18n-service.provider';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  pdfSrc: any;

  constructor(
    private i18NServiceProvider: I18NServiceProvider,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.i18NServiceProvider.getCurrentLanguagePackLoaded().subscribe(lang => {
      console.log('TCL: TermsAndConditionsComponent -> ngOnInit -> lang', lang);
      this.pdfSrc = `assets/pdf/Travined_terms_${lang}.pdf`;
      console.log(
        'TCL: TermsAndConditionsComponent -> ngOnInit -> pdfSrc',
        this.pdfSrc
      );
    });
  }
}
