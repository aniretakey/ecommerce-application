import { getDeleteIcon } from '@pages/user-profile/user-profile-ui';
import BaseComponent from '@utils/baseComponent';

export class CartItem {
  public cartItem: BaseComponent<'div'>;

  constructor(lineItemId: string) {
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

    const removeItemBtn = new BaseComponent({
      tagName: 'button',
      classNames: ['remove-cart-item', 'col-start-5', 'row-start-1'],
    });
    removeItemBtn.getNode().innerHTML = getDeleteIcon();

    this.cartItem.appendChildren([
      productImg,
      productName,
      this.createPriceContainer(price, discount),
      this.createQuantityContainer(quantityVal),
      removeItemBtn,
    ]);
    return this.cartItem;
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
    const quantityContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['quantity-container', 'col-start-2', 'row-start-2', 'flex', 'align-center', 'gap-1.5'],
    });
    const quantityReduceBtn = new BaseComponent({
      tagName: 'div',
      classNames: ['reduce-btn', 'text-2xl', 'btn', 'btn-sm', 'btn-primary', 'px-4', 'w-9', 'h-9'],
      textContent: '-',
    });
    const quantity = new BaseComponent({
      tagName: 'input',
      attributes: { type: 'number', value: `${quantityVal}`, min: '0', max: '1000000' },
      classNames: ['input', 'input-bordered', 'w-16', 'input-sm', 'h-9'],
    });
    const quantityIncreaseBtn = new BaseComponent({
      tagName: 'div',
      classNames: ['increase-btn', 'text-3xl', 'btn', 'btn-sm', 'btn-primary', 'font-light', 'px-3', 'w-9', 'h-9'],
      textContent: '+',
    });
    quantityContainer.appendChildren([quantityReduceBtn, quantity, quantityIncreaseBtn]);
    return quantityContainer;
  }
}
