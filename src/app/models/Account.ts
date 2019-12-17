import { Address } from './Address';
import { AccountStatus } from '../enum/AccountStatus';

// tslint:disable-next-line: class-name
export class Account {
  public constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }

  id?: string;
  name?: string;
  lastName?: string;
  birthday?: Date;
  address?: Address;
  email?: string;
  phone?: string;
  role: string;
  password?: string;
  accountStatus: AccountStatus;
  creationDate?: string;
}
