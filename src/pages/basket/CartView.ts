import { createCart, getCart, saveNewCartId } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { CartItem } from './CartItem';
import { CartSummary } from './summary';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';
//import { CartItem } from './CartItem';
//import { CartSummary } from './summary';
//import { getCart } from '@utils/apiRequests';

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
    const cartId = localStorage.getItem('comforto-cart-id') ?? '';
    this.cart.append(this.cartItemsContainer);
    getCart(cartId)
      .then((data) => {
        this.displayCartItems(data);
      })
      .catch(() =>
        createCart([]).then((data) => {
          saveNewCartId(data);
          this.cartItemsContainer.getNode().innerHTML = 'Cart is empty';
        }),
      );
  }

  private displayCartItems(data: ClientResponse<Cart>): void {
    const cartData = data.body;
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
    this.cart.append(new CartSummary(cartData?.totalPrice.centAmount ?? 0).summary);
  }
}
