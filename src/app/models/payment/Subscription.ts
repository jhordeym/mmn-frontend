// tslint:disable-next-line: class-name
import { PaymentMethod } from 'src/app/enum/PaymentMethod';
import { ShoppingCart } from './ShoppingCart';
import { Product } from './Product';

export class Subscription {
  public constructor(init?: Partial<Subscription>) {
    Object.assign(this, init);
  }

  id?: string;
  accountId?: string;
  product: Product[];
  start?: Date;
  current?: Date;
  next?: Date;
  renovationTimes?: number;
  invitationLeft?: number;
}
