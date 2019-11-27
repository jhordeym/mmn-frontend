// tslint:disable-next-line: class-name
import { PaymentMethod } from 'src/app/enum/PaymentMethod';

export class Payment {
  public constructor(init?: Partial<Payment>) {
    Object.assign(this, init);
  }

  id?: string;
  method?: PaymentMethod;
  value?: string;
  currency_code?: string;
}
