import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { PaymentService } from '../services/backend/payment.service';
import { CachingService } from '../services/caching.service';
import { Account } from '../models/Account';

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
    const accountCache : Account = this.cachingService.getSession();
    const paymentCache = this.cachingService.getPaymentCache();
    if (!this.paymentActive(accountCache, paymentCache)) {
      this.router.navigate(['signin']);
    }
    return true;
  }

  private paymentActive(account: Account, paymentCache: any) {
    if (account) {
      if (['ADMIN', 'INVESTOR', 'AMBASSADOR'].indexOf(account.role) != -1) {
        return true;
      }
    }
    return paymentCache ? true : false;
  }
}
