import { Injectable } from '@angular/core';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  constructor() {}

  // ACCOUNT CACHE
  saveSecret(secret: string): void {
    localStorage.setItem('xxxxx', secret);
  }

  saveSession(account: Account): void {
    localStorage.setItem('session', JSON.stringify(account));
  }

  saveRecover(account: Account): void {
    localStorage.setItem('accountRecover', JSON.stringify(account));
  }

  saveRegisterStep(step: number, data: any) {
    localStorage.setItem(`register-step-${step}`, JSON.stringify(data));
  }

  getSecret(): string {
    return localStorage.getItem('xxxxx');
  }

  getSession(): Account {
    const account: string = localStorage.getItem('session');
    if (!account) return null;
    return JSON.parse(account);
  }

  getAccountRecover(): Account {
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
}
