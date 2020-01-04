import { Component, OnInit } from '@angular/core';
import { PaypalTransactionStatus } from 'src/app/enum/PaypalTransationStatus';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-payment-validation',
  templateUrl: './payment-validation.component.html',
  styleUrls: ['./payment-validation.component.scss']
})
export class PaymentValidationComponent implements OnInit {
  continueAfterPayment = false;
  account: Account;

  constructor(
    private accountService: AccountService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.account = this.accountService.getSession();
    this.paymentService.findLatestSubscriptionBy(this.account.id).subscribe(
      res => {
        if (res) {
          const currentDate = new Date();
          const validateDate =
            currentDate >= new Date(res['current']) &&
            currentDate <= new Date(res['next']);
          console.log(validateDate);
          if (validateDate) {
            this.paymentService.savePaymentCache(res);
            this.goToHome();
          }
        }
      },
      err => {}
    );
    const monthlyPayment = this.paymentService._getMonthlyPayment();
    if (monthlyPayment) {
      this.goToHome();
    }
  }

  receiveConfirmation(event) {
    this.continueAfterPayment =
      event.status === PaypalTransactionStatus.Successful;
    this.paymentService._saveMonthlyPayment(this.continueAfterPayment);
  }

  goToHome() {
    this.router.navigate(['']);
  }

  isAdminOrInfluencer() {
    return this.account.role ===  'ADMIN' || this.account.role === 'INFLUENCER';
  }
}
