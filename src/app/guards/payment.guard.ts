import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {
  constructor(public payment: PaymentService, public router: Router) {}

  canActivate(): boolean {
    if (!this.payment.paymentActive()) {
      this.router.navigate(['signin']);
    }
    return true;
  }
}
