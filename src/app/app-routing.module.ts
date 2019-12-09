import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardPageComponent } from './components/home/dashboard-page/dashboard-page.component';
import { ForgotPassComponent } from './components/signin/forgot-pass/forgot-pass.component';
import { ProfilePageComponent } from './components/home/profile-page/profile-page.component';
import { SettingsPageComponent } from './components/home/settings-page/settings-page.component';
import { ProductsPageComponent } from './components/home/products-page/products-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'settings', component: SettingsPageComponent }
    ]
  },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotPassComponent },
  { path: '**', redirectTo: '' }
];

const config = { useHash: true, enableTracing: false };

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
