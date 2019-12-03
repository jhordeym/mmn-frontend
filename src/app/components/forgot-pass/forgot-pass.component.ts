import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AccountService } from 'src/app/services/account.service';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
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
    private account: AccountService,
    private fb: FormBuilder,
    private route: Router
  ) {
    this.loginForm = this.fb.group({
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
    this.account.login(login).subscribe(
      data => {
        this.unoutorizedMessage = false;
        this.account.saveSession(data);
        this.route.navigate(['']);
        // redirect to home page
        console.log(data);
      },
      error => {
        this.unoutorizedMessage = true;
        console.log(error);
      }
    );
  }
}
