import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-users-config',
  templateUrl: './users-config.component.html',
  styleUrls: ['./users-config.component.scss']
})
export class UsersConfigComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  error = null;

  USERS = new Array<Account>();

  showError() {
    return this.error;
  }

  ngOnInit() {
    this.accountService.listAll().subscribe((data: Array<Account>) => {
      if (data) {
        this.USERS = data;
      }
    });
  }
}
