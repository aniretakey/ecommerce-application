import { getDeleteIcon } from '@pages/user-profile/user-profile-ui';
import BaseComponent from '@utils/baseComponent';
import { CartQuantity } from '@components/cartQuantityContainer';
import { changeLineItemQuantity } from '@utils/apiRequests';
import { CartView } from './CartView';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { EmptyCart } from './EmptyCart';

export class CartItem {
  public cartItem: BaseComponent<'div'>;
  private lineItemId: string;

  constructor(lineItemId: string) {
    this.lineItemId = lineItemId;
    this.cartItem = new BaseComponent({
      tagName: 'div',
      classNames: ['cart-item', 'grid', 'grid-cols-5', 'grid-rows-2', 'gap-4'],
      attributes: { 'data-lineItemId': lineItemId },
    });
  }

  public create(name: string, price: number, imgSrc: string, discount?: number, quantityVal = 1): BaseComponent<'div'> {
    const productImg = new BaseComponent({
      tagName: 'img',
      attributes: { src: imgSrc, alt: name },
      classNames: ['cart-item-img', 'w-36', 'h-36', 'row-span-2'],
    });

    const productName = new BaseComponent({
      tagName: 'p',
      textContent: name,
      classNames: ['product-name', 'w-full', 'col-span-3', 'font-semibold', 'text-base'],
    });

    this.cartItem.appendChildren([
      productImg,
      productName,
      this.createPriceContainer(price, discount),
      this.createQuantityContainer(quantityVal),
      this.createRemoveItemBtn(),
    ]);
    return this.cartItem;
  }

  private createRemoveItemBtn(): BaseComponent<'button'> {
    const removeItemBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['remove-cart-item', 'col-start-5', 'row-start-1', 'w-4'],
    });

    removeItemBtn.getNode().innerHTML = getDeleteIcon();

    removeItemBtn.addListener('click', (e: Event) => {
      const { target } = e;
      if (target) {
        const cartId = localStorage.getItem('comforto-cart-id') ?? '';
        changeLineItemQuantity(cartId, this.lineItemId, 0, CartView.cartVersion)
          .then((data) => {
            CartView.cartVersion = data.body.version;
            this.cartItem.destroy();
            localStorage.setItem('prevPrice', `${data.body.totalPrice.centAmount / 100 + 1000}`);
            safeQuerySelector<HTMLParagraphElement>('.discounted-price').textContent = `₽${
              (data.body.totalPrice.centAmount ?? 0) / 100
            }`;
            safeQuerySelector<HTMLParagraphElement>('.total-price').textContent = `₽${
              (data.body.totalPrice.centAmount ?? 0) / 100 + 1000
            }`;
            if (data.body.lineItems.length === 0) {
              safeQuerySelector<HTMLParagraphElement>('.summary').remove();
              new EmptyCart(safeQuerySelector<HTMLElement>('.cart-items-container'));
              localStorage.removeItem('appliedCouponId');
              localStorage.removeItem('appliedCouponName');
              localStorage.removeItem('prevPrice');
            }
          })
          .catch(console.log);
      }
    });
    return removeItemBtn;
  }

  private createPriceContainer(price: number, discount?: number): BaseComponent<'div'> {
    const pricesContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['product-prices', 'col-span-2', 'col-start-4', 'row-start-2'],
    });

    const productPrice = new BaseComponent({
      tagName: 'p',
      classNames: ['product-price', 'text-primary'],
      textContent: `₽${price / 100}`,
    });
    pricesContainer.append(productPrice);
    if (discount) {
      const productDiscount = new BaseComponent({
        tagName: 'p',
        classNames: ['product-price', 'text-accent'],
        textContent: `₽${discount / 100}`,
      });
      productPrice.addClass(['line-through', 'opacity-50']);
      pricesContainer.append(productDiscount);
    }
    return pricesContainer;
  }

  private createQuantityContainer(quantityVal = 1): BaseComponent<'div'> {
    const quantityContainer = new CartQuantity(this.lineItemId, quantityVal).quantityContainer;
    return quantityContainer;
  }
}
