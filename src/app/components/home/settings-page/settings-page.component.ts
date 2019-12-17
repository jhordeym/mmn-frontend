import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  account: Account;
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.account = this.accountService.getSession();
    // console.log(this.account);
  }

  isAdmin() {
    return this.account.role ===  'ADMIN';
  }

}
