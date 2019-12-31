import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { Product } from '../models/payment/Product';
import { ShoppingCart } from '../models/payment/ShoppingCart';
import { Payment } from '../models/payment/Payment';
import { PaymentMockService } from './payment.mock.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private mockService: PaymentMockService
  ) {}

  public getAllSubscriptionProducts(): Promise<Product[]> {
    return ENV.useMock
      ? new Promise(resolve => resolve(this.mockService.mockProductList))
      : this.http
          .get<Product[]>(`${ENV.paymentServiceURL}/subscription-products`)
          .toPromise();
  }

  public getAllProducts(): Promise<Product[]> {
    return ENV.useMock
      ? new Promise(resolve => resolve(this.mockService.mockProductList))
      : this.http
          .get<Product[]>(`${ENV.paymentServiceURL}/products`)
          .toPromise();
  }

  public saveShoppingCart(ShoppingCart: ShoppingCart) {
    return this.http.post<ShoppingCart>(
      `${ENV.paymentServiceURL}/shopping-cart`,
      ShoppingCart
    );
  }

  public savePayment(payment: Payment) {
    return this.http.post<Payment>(
      `${ENV.paymentServiceURL}/payments`,
      payment
    );
  }

  public findLatestSubscriptionBy(accountId: string) {
    return this.http.get<any>(
      `${ENV.paymentServiceURL}/subscriptions/${accountId}`
    );
  }

  // GUARD
  paymentActive() {
    return this.getPaymentCache() ? true : false;
  }

  // CACHE
  savePaymentCache(payment: Payment): void {
    localStorage.setItem('subscription', JSON.stringify(payment));
  }

  getPaymentCache(): Payment {
    const token: string = localStorage.getItem('subscription');
    if (!token) return null;
    return JSON.parse(token);
  }

  _getMonthlyPayment() {
    const monthlyPayment: string = localStorage.getItem('monthlyPayment');
    if (!monthlyPayment) return null;
    return JSON.parse(monthlyPayment);
  }

  _saveMonthlyPayment(paymentStatus) {
    const monthlyPayment = {
      date: new Date(),
      paymentStatus: paymentStatus
    };
    localStorage.setItem('monthlyPayment', JSON.stringify(monthlyPayment));
  }
}
