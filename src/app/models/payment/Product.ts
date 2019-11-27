// tslint:disable-next-line: class-name
export class Product {
  public constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }

  id?: string;
  name?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  price?: number;
  priceTC?: number;
}
