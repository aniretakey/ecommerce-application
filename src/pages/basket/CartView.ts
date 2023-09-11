import { createCart, getCart, saveNewCartId } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { CartItem } from './CartItem';
import { CartSummary } from './summary';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { EmptyCart } from './EmptyCart';

export class CartView {
  public cart: BaseComponent<'div'>;
  private cartItemsContainer: BaseComponent<'div'>;
  public static cartVersion = 1;

  constructor() {
    this.cart = new BaseComponent({
      tagName: 'div',
      classNames: ['cart', 'flex', 'flex-col', 'align-center', 'gap-12'],
    });

    this.cartItemsContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['cart-items-container', 'flex', 'flex-col', 'align-center', 'gap-4', 'w-full'],
    });
    this.getCartInfo();
  }

  private getCartInfo(): void {
    const cartId = localStorage.getItem('comforto-cart-id') ?? '';
    this.cart.append(this.cartItemsContainer);
    getCart(cartId)
      .then((data) => {
        this.displayCartItems(data);
        CartView.cartVersion = data.body.version;
      })
      .catch(() =>
        createCart([]).then((data) => {
          saveNewCartId(data);
          new EmptyCart(this.cartItemsContainer.getNode());
          CartView.cartVersion = data.body.version;
        }),
      );
  }

  private displayCartItems(data: ClientResponse<Cart>): void {
    const cartData = data.body;
    cartData?.lineItems.forEach((res) => {
      this.cartItemsContainer.append(
        new CartItem(res.id).create(
          res.name.ru ?? '',
          res.price.value.centAmount,
          (res.variant.images ?? [])[0]?.url ?? '',
          res.price.discounted?.value.centAmount,
          res.quantity,
        ),
      );
    });
    if (cartData?.lineItems.length > 0) {
      this.cart.append(new CartSummary(cartData?.totalPrice.centAmount ?? 0).summary);
    } else {
      new EmptyCart(this.cartItemsContainer.getNode());
    }
  }
}
