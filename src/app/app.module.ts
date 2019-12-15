import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { ForgotPassComponent } from './components/signin/forgot-pass/forgot-pass.component';
import { DashboardPageComponent } from './components/home/dashboard-page/dashboard-page.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsPageComponent } from './components/home/products-page/products-page.component';
import { ProfilePageComponent } from './components/home/profile-page/profile-page.component';
import { SettingsPageComponent } from './components/home/settings-page/settings-page.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { SubscriptionPaymentComponent } from './components/signup/subscription-payment/subscription-payment.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { I18NServiceProvider } from './providers/i18n-service.provider';
import { LogoutComponent } from './components/logout/logout.component';
import { ModalComponent } from './shared/components/modal/modal.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    SubscriptionPaymentComponent,
    DashboardPageComponent,
    HomeComponent,
    ForgotPassComponent,
    ShoppingCartComponent,
    UnderConstructionComponent,
    ConfirmAccountComponent,
    ProfilePageComponent,
    ProductsPageComponent,
    SettingsPageComponent,
    LogoutComponent,
    ModalComponent
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
