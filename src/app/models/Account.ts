import { Address } from './Address';
import { AccountStatus } from '../enum/AccountStatus';

// tslint:disable-next-line: class-name
export class Account {
  id?: string;
  name?: string;
  lastName?: string;
  birthday?: Date;
  address?: Address;
  email?: string;
  phone?: string;
  password?: string;
  accountStatus: AccountStatus;
  creationDate?: string;
}
