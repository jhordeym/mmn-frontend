import { Component, OnInit } from '@angular/core';
import { PaypalTransactionStatus } from 'src/app/enum/PaypalTransationStatus';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-validation',
  templateUrl: './payment-validation.component.html',
  styleUrls: ['./payment-validation.component.scss']
})
export class PaymentValidationComponent implements OnInit {
  continueAfterPayment = false;

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit() {
    const monthlyPayment = this.paymentService._getMonthlyPayment();
    if(monthlyPayment) {
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


}
