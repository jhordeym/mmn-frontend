import { Injectable } from '@angular/core';
import { Product } from '../models/payment/Product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as ENV } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { reject } from 'q';
import { Payment } from '../models/payment/Payment';
import { ShoppingCart } from '../models/payment/ShoppingCart';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private mockProductList = [
    new Product({
      name: 'Travined Explorer',
      description:
        '<ul class="list-group list-group-flush"> <li class="list-group-item">✅ Mytrip360° Customer Site with:</li> <li class="list-group-item">✅ * Hotels</li> <li class="list-group-item">❌ * Flights</li> <li class="list-group-item">❌ * Rental Cars</li> <li class="list-group-item">❌ * Cruises </li> <li class="list-group-item">❌ * Homes </li> <li class="list-group-item">❌ * Weeks </li> <li class="list-group-item">❌ * Marketplace </li> <li class="list-group-item"></li> <li class="list-group-item">✅ 8 Passports to send</li> <li class="list-group-item">❌ iDecide Interactive Sales System</li> <li class="list-group-item">✅ 10% of referral - direct invitation</li> <li class="list-group-item">✅ Travined Online Management System</li> <li class="list-group-item">✅ 25% Passport Bonuses</li></ul>',
      price: 59.99,
      priceTC: 45
    }),
    new Product({
      name: 'Travined Explorer ⭐⭐⭐',
      description:
        '<ul class="list-group list-group-flush"> <li class="list-group-item">✅ Mytrip360° Professional Affiliate Site with: </li> <li class="list-group-item">✅ * Hotels</li> <li class="list-group-item">✅ * Flights</li> <li class="list-group-item">✅ * Rental Cars</li> <li class="list-group-item">❌ * Cruises </li> <li class="list-group-item">❌ * Homes </li> <li class="list-group-item">❌ * Weeks </li> <li class="list-group-item">❌ * Marketplace </li> <li class="list-group-item"></li> <li class="list-group-item">✅ 18 Passports to send</li> <li class="list-group-item">✅ iDecide Interactive Sales System</li> <li class="list-group-item">✅ 20% of referral - direct invitation</li> <li class="list-group-item">✅ Travined Online Back Office MLM Management</li> <li class="list-group-item">✅ 50% Passport Bonuses</li></ul>',
      price: 299.99,
      priceTC: 225
    }),
    new Product({
      name: 'Travined Explorer ⭐⭐⭐⭐',
      description:
        '<ul class="list-group list-group-flush"> <li class="list-group-item">✅ Mytrip360° Professional Affiliate Site with: </li> <li class="list-group-item">✅ * Hotels</li> <li class="list-group-item">✅ * Flights</li> <li class="list-group-item">✅ * Rental Cars</li> <li class="list-group-item">✅ * Cruises </li> <li class="list-group-item">❌ * Homes </li> <li class="list-group-item">❌ * Weeks </li> <li class="list-group-item">❌ * Marketplace </li> <li class="list-group-item"></li> <li class="list-group-item">✅ 32 Passports to send</li> <li class="list-group-item">✅ iDecide Interactive Sales System</li> <li class="list-group-item">✅ 20% of referral - direct invitation</li> <li class="list-group-item">✅ Travined Online Back Office MLM Management</li> <li class="list-group-item">✅ 100% Passports Bonuses</li></ul>',
      price: 499.99,
      priceTC: 375
    }),
    new Product({
      name: 'Travined Explorer ⭐⭐⭐⭐⭐',
      description:
        '<ul class="list-group list-group-flush"> <li class="list-group-item">✅ Mytrip360° Professional Affiliate Site with: </li> <li class="list-group-item">✅ * Hotels</li> <li class="list-group-item">✅ * Flights</li> <li class="list-group-item">✅ * Rental Cars</li> <li class="list-group-item">✅ * Cruises </li> <li class="list-group-item">✅ * Homes </li> <li class="list-group-item">✅ * Weeks </li> <li class="list-group-item">✅ * Marketplace </li> <li class="list-group-item"></li> <li class="list-group-item">✅ 32 Passports to send</li> <li class="list-group-item">✅ iDecide Interactive Sales System</li> <li class="list-group-item">✅ 20% of referral - direct invitation</li> <li class="list-group-item">✅ Travined Online Back Office MLM Management</li> <li class="list-group-item">✅ 100% Passports Bonuses</li></ul>',
      price: 799.99,
      priceTC: 600
    })
  ];

  getAllSubscriptionProducts(): Promise<Product[]> {
    return ENV.useMock
      ? new Promise(resolve => resolve(this.mockProductList))
      : this.http
          .get<Product[]>(`${ENV.paymentServiceURL}/products`)
          .toPromise();
  }

  saveShoppingCart(ShoppingCart: ShoppingCart) {
    return this.http.post<ShoppingCart>(
      `${ENV.accountServiceURL}/shopping-cart`,
      ShoppingCart
    );
  }

  constructor(private http: HttpClient) {}
}
