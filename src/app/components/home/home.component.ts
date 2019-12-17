import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  account: Account;
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.account = this.accountService.getSession();
    // console.log(this.account);
  }
}
