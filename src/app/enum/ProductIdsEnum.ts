import { SorSubscriptionPlans } from './sor-enums/SorSubscriptionPlans';

export class ProductIdsEnum {
  static readonly Basic = new ProductIdsEnum(
    'Basic',
    SorSubscriptionPlans.Basic,
    'subscriptions.pack.1.description'
  );
  static readonly ThreeStars = new ProductIdsEnum(
    'ThreeStars',
    SorSubscriptionPlans.ThreeStars,
    'subscriptions.pack.2.description'
  );
  static readonly FourStars = new ProductIdsEnum(
    'FourStars',
    SorSubscriptionPlans.FourStars,
    'subscriptions.pack.3.description'
  );
  static readonly FiveStars = new ProductIdsEnum(
    'FiveStars',
    SorSubscriptionPlans.FiveStars,
    'subscriptions.pack.4.description'
  );

  static LIST: ProductIdsEnum[] = [
    ProductIdsEnum.Basic,
    ProductIdsEnum.ThreeStars,
    ProductIdsEnum.FourStars,
    ProductIdsEnum.FiveStars
  ];

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly index: string,
    public readonly value: string
  ) {}

  public static match(value: string): string {
    const result: ProductIdsEnum[] = ProductIdsEnum.LIST.filter(
      p => p.value === value
    );
    if (result.length === 1) {
      const index = result[0].index;
      console.log('TCL: ProductIdsEnum -> index', index);
      return index;
    }
    return ProductIdsEnum.Basic.index;
  }

  toString() {
    return this.key;
  }
}
