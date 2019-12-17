import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  account: Account;
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.account = this.accountService.getSession();
    // console.log(this.account);
  }
}
