import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AccountService } from 'src/app/services/account.service';
import { environment as ENV } from 'src/environments/environment';
import { ChangePass } from 'src/app/models/ChangePass';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  logo = ENV.imageLogoBig;

  forgotForm: any;
  successful = false;

  get email() {
    return this.forgotForm.get('email');
  }

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private route: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  validateBeforeSubmit() {
    if (this.forgotForm.valid) {
      this.changePass(this.email.value);
    }
  }

  changePass(changePass: string) {
    this.accountService.forgot(changePass).subscribe(
      (data: string) => {
        if (data) {
          this.successful = true;
          console.log(data);
        }
      },
      error => {
        this.successful = false;
        console.log(error);
      }
    );
  }
}
