import BaseComponent from '@utils/baseComponent';
import emptyCartImage from '@assets/img/basket/emptyCart.png';

const classNames = {
  container: ['flex', 'flex-col', 'justify-center', 'items-center'],
  image: ['max-w-lg', 'my-4'],
  link: ['btn', 'btn-secondary', 'my-4'],
};

export class EmptyCart {
  private emptyCart = new BaseComponent({
    tagName: 'div',
    classNames: classNames.container,
  });

  constructor(scope: HTMLElement) {
    this.createEmptyCart();
    scope.append(this.emptyCart.getNode());
  }

  private createEmptyCart(): void {
    const image = new BaseComponent({
      tagName: 'img',
      attributes: { src: `${emptyCartImage}`, alt: 'empty cart' },
      classNames: classNames.image,
    });
    const title = new BaseComponent({ tagName: 'h5', textContent: 'Your cart is empty' });
    const message = new BaseComponent({ tagName: 'p', textContent: 'Please add something in your cart' });
    const link = new BaseComponent({
      tagName: 'a',
      textContent: 'Continue shopping',
      attributes: {
        'data-navigo': '',
        href: '/#/catalog-page',
      },
      classNames: classNames.link,
    });
    this.emptyCart.appendChildren([image, title, message, link]);
  }
}
