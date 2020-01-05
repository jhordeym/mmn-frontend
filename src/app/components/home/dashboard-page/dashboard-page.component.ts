import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/backend/account.service';
import { AccountModel } from 'src/app/models/AccountModel';
import { AccountStatus } from 'src/app/enum/AccountStatus';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CachingService } from 'src/app/services/caching.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  account: AccountModel;
  dashboardForm: any;
  disable = true;

  get inviteToken() {
    return this.dashboardForm.get('inviteToken');
  }

  get linkUrl() {
    return 'https%3A%2F%2Flogin.travined.com%3A8080%2F%23%2Fsignup%3FinviteToken%3D' + this.inviteToken.value + '&title=Travined';
  }

  constructor(
    private accountService: AccountService,
    private cachingService: CachingService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.dashboardForm = this.formBuilder.group({
      name: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      phone: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      accountStatus: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      role: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      creationDate: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ],
      inviteToken: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(1)]
      ]
    });
  }

  ngOnInit() {
    this.account = this.cachingService.getSession();
    this.dashboardForm.patchValue(this.account);
    // console.log(this.account);
  }

  isNewAccount() {
    const newAccountStatus = AccountStatus.New;
    const currentAccountStatus = this.account.accountStatus;
    const check = currentAccountStatus === newAccountStatus;
    return check;
  }
}
