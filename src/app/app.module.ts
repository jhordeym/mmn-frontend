import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { I18NServiceProvider } from './providers/i18n-service.provider';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PaymentComponent } from './components/payment/payment.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    DashboardComponent,
    HomeComponent,
    ForgotPassComponent,
    PaymentComponent,
    ShoppingCartComponent,
    UnderConstructionComponent,
    ConfirmAccountComponent
  ],
  imports: [
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [I18NServiceProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
