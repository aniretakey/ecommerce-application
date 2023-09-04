import BaseComponent from '@utils/baseComponent';
import { CartItem } from './CartItem';
import { CartSummary } from './summary';
import { getCart } from '@utils/apiRequests';

export class CartView {
  public cart: BaseComponent<'div'>;
  private cartItemsContainer: BaseComponent<'div'>;

  constructor() {
    this.cart = new BaseComponent({
      tagName: 'div',
      classNames: ['cart', 'flex', 'flex-col', 'align-center', 'gap-12'],
    });

    this.cartItemsContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['cart-items-container', 'flex', 'flex-col', 'align-center', 'gap-4'],
    });
    this.getCartInfo();
  }

  private getCartInfo(): void {
    getCart()
      .then((data) => {
        const cartData = data.body.results[0];
        cartData?.lineItems.forEach((res) => {
          this.cartItemsContainer.append(
            new CartItem().create(
              res.name.ru ?? '',
              res.price.value.centAmount,
              (res.variant.images ?? [])[0]?.url ?? '',
              res.price.discounted?.value.centAmount,
              res.quantity,
            ),
          );
        });
        this.cart.appendChildren([
          this.cartItemsContainer,
          new CartSummary(cartData?.totalPrice.centAmount ?? 0).summary,
        ]);
      })
      .catch(console.log);
  }
}
