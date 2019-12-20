import { Component, OnInit } from '@angular/core';
import { PaypalTransactionStatus } from 'src/app/enum/PaypalTransationStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-validation',
  templateUrl: './payment-validation.component.html',
  styleUrls: ['./payment-validation.component.scss']
})
export class PaymentValidationComponent implements OnInit {
  continueAfterPayment = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  receiveConfirmation(event) {
    this.continueAfterPayment =
      event.status === PaypalTransactionStatus.Successful;
  }

  goToHome() {
    this.router.navigate(['']);
  }

  private _getPayment() {
    const monthlyPayment: string = localStorage.getItem('monthlyPayment');
    if (!monthlyPayment) return null;
    return JSON.parse(monthlyPayment);
  }

  private _savePayment() {
    const monthlyPayment = {
      date: new Date(),
      paymentStatus: this.continueAfterPayment
    };
    localStorage.setItem('monthlyPayment', JSON.stringify(monthlyPayment));
  }
}
