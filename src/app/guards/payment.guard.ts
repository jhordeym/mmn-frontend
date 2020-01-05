import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { CachingService } from '../services/caching.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {
  constructor(
    public payment: PaymentService,
    public cachingService: CachingService,
    public router: Router
  ) {}

  canActivate(): boolean {
    const account = this.cachingService.getSession();
    if (!this.payment.paymentActive(account)) {
      this.router.navigate(['signin']);
    }
    return true;
  }
}
