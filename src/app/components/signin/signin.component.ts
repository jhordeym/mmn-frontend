import { Component, OnInit } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { Login } from 'src/app/models/Login';
import {
  FormControl,
  FormBuilder,
  AbstractControl,
  Validators
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Account } from 'src/app/models/Account';

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
          this.accountService.saveSession(data);
          // redirect to home page
          this.router.navigate(['']);
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
