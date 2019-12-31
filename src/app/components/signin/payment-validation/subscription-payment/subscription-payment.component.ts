import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { PaymentMethod } from 'src/app/enum/PaymentMethod';
import { PaypalTransactionStatus } from 'src/app/enum/PaypalTransationStatus';
import { CartProduct } from 'src/app/models/payment/CartProduct';
import { Payment } from 'src/app/models/payment/Payment';
import { Product } from 'src/app/models/payment/Product';
import { ShoppingCart } from 'src/app/models/payment/ShoppingCart';
import { PaymentService } from 'src/app/services/payment.service';

declare var paypal;

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss']
})
export class SubscriptionPaymentComponent implements OnInit {
  @Output() completedSubscription = new EventEmitter();
  @Input() 'useSubscription'?: boolean;
  @ViewChild('paypal') paypalElement: ElementRef;

  products: Product[];
  paidFor = false;
  shoppingCart: ShoppingCart;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.getAllSubscriptionProducts().then(prods => {
      this.products = prods;
    });
  }

  selectSubscription(item: Product) {
    this.shoppingCart = new ShoppingCart();
    const cartProduct = new CartProduct();
    cartProduct.product = item;
    cartProduct.quantity = 1;
    cartProduct.price = item.price;
    const cartProducts = new Array<CartProduct>(cartProduct);
    this.shoppingCart.products = cartProducts;
    // console.log(this.shoppingCart);

    this.addPaypalButton();
  }

  addPaypalButton() {
    if (this.paypalElement && this.paidFor == false) {
      this.removePaypalButton();
    }
    paypal
      .Buttons(
        this.useSubscription
          ? this._createSub()
          : this._createOrder(this.shoppingCart)
      )
      .render(this.paypalElement.nativeElement);
  }

  removePaypalButton() {
    this.paypalElement.nativeElement.innerHTML = null;
  }

  // SUBSCRIPTION
  _createSub(): any {
    return {
      createSubscription: (data, actions) => {
        return actions.subscription.create({
          plan_id: 'P-2UF78835G6983425GLSM44MA'
        });
      },

      onApprove: (data, actions) => {
        alert(
          'You have successfully created subscription ' + data.subscriptionID
        );
      }
    };
  }

  // ORDER
  _createOrder(shoppingCart: ShoppingCart) {
    return {
      createOrder: (data, actions) => {
        return this._onCreateOrder(actions, shoppingCart);
      },
      onApprove: async (data, actions) => {
        this._onApproveOrder(data, actions);
      },
      onError: error => {
        console.log(error);
      }
    };
  }

  private _onCreateOrder(actions, shoppingCart: ShoppingCart) {
    const request = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: shoppingCart.products
              .map(p => p.price)
              .reduce((acc, pilot) => acc + pilot, 0)
              .toString()
          },
          description: shoppingCart.products.map(
            CartProduct => CartProduct.product.name
          ).reduce
          /*
          items: shoppingCart.products.map(
            cart_prod =>
              new Object({
                name: cart_prod.product.name,
                quantity: cart_prod.quantity,
                description: cart_prod.product.description,
                category: 'DIGITAL_GOODS'
              })
          )
          */
        }
      ]
    };
    console.log(request);
    return actions.order.create(request);
  }

  private async _onApproveOrder(data, actions) {
    const order = await actions.order.capture();
    console.log(JSON.stringify(order));

    this.paidFor = true;
    // persistOrderInBD
    const units = order.purchase_units[0];

    const payment = new Payment();
    payment.id = order.id;
    payment.method = PaymentMethod.Paypal;
    payment.value = units.amount.value;
    payment.currency_code = units.amount.currency_code;
    // caching payment
    this.paymentService.savePaymentCache(payment);

    this.shoppingCart.payment = payment;
    // console.log(this.shoppingCart);

    this.paymentService.saveShoppingCart(this.shoppingCart).subscribe(
      data => {
        if (data) {
          // emit event to parent
          this.completedSubscription.emit({
            status: PaypalTransactionStatus.Successful
          });
        }
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
