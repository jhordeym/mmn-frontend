import { Injectable } from '@angular/core';
import { AccountModel } from '../models/AccountModel';
import { Payment } from '../models/payment/Payment';
import { SubscriptionModel } from '../models/payment/SubscriptionModel';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  constructor() {}

  // ACCOUNT CACHE
  saveSecret(secret: string): void {
    localStorage.setItem('xxxxx', secret);
  }

  saveSession(account: AccountModel): void {
    localStorage.setItem('session', JSON.stringify(account));
  }

  saveRecover(account: AccountModel): void {
    localStorage.setItem('accountRecover', JSON.stringify(account));
  }

  saveRegisterStep(step: number, data: any) {
    localStorage.setItem(`register-step-${step}`, JSON.stringify(data));
  }

  getSecret(): string {
    return localStorage.getItem('xxxxx');
  }

  getSession(): AccountModel {
    const account: string = localStorage.getItem('session');
    if (!account) return null;
    return JSON.parse(account);
  }

  getAccountRecover(): AccountModel {
    const account: string = localStorage.getItem('accountRecover');
    if (!account) return null;
    return JSON.parse(account);
  }

  getRegisterStep(step: number) {
    const data = localStorage.getItem(`register-step-${step}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  deleteSecret() {
    localStorage.removeItem('xxxxx');
  }

  deleteSession() {
    localStorage.removeItem('session');
  }

  logout() {
    this.deleteSecret();
    this.deleteSession();
  }

  // PAYMENT
  // CACHE
  savePaymentCache(payment: Payment): void {
    localStorage.setItem('payment', JSON.stringify(payment));
  }

  getPaymentCache(): Payment {
    const token: string = localStorage.getItem('payment');
    if (!token) return null;
    return JSON.parse(token);
  }

  saveSubscriptionCache(payment: SubscriptionModel): void {
    localStorage.setItem('subscription', JSON.stringify(payment));
  }

  getSubscriptionCache(): SubscriptionModel {
    const token: string = localStorage.getItem('subscription');
    if (!token) return null;
    return JSON.parse(token);
  }
}
