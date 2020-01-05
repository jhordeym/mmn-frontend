import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/Account';
import { Login } from 'src/app/models/Login';
import { AccountService } from 'src/app/services/backend/account.service';
import { CachingService } from 'src/app/services/caching.service';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  logo = ENV.imageLogoBig;

  loginForm: any;
  unoutorizedMessage = false;

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private accountService: AccountService,
    private cachingService: CachingService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  validateBeforeSubmit() {
    if (this.loginForm.valid) {
      const login = new Login();
      login.login = this.login.value;
      login.password = this.password.value;
      this.doLogin(login);
    }
  }

  doLogin(login: Login) {
    this.accountService.login(login).subscribe(
      (data : Account) => {
        if(data){
          this.unoutorizedMessage = false;
          this.cachingService.saveSession(data);
          this.cachingService.saveSecret(login.password);

          // redirect to home page
          this.router.navigate(['payment-validation']);
        } else {
          this.unoutorizedMessage = true;
        }
        console.log(data);
      },
      error => {
        this.unoutorizedMessage = true;
        console.log(error);
      }
    );
  }
}
