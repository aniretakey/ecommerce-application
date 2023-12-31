import { addProductInCart, createCart, getCart, saveNewCartId } from '@utils/apiRequests';
import BaseComponent from '../../utils/baseComponent';
import { Alert } from '@components/alert/Alert';
import { CartView } from '@pages/basket/CartView';

export class CatalogCard {
  public card: BaseComponent<'div'>;
  public categories: BaseComponent<'div'>;
  public cardBody: BaseComponent<'div'>;
  public photo: BaseComponent<'img'>;
  public priceContainer: BaseComponent<'div'>;
  public name: BaseComponent<'h5'>;
  public description: BaseComponent<'p'>;
  public price: BaseComponent<'p'>;
  public discount: BaseComponent<'p'>;
  public infoButton: BaseComponent<'a'>;

  constructor() {
    this.card = new BaseComponent({
      tagName: 'div',
      classNames: ['card', 'card-compact', 'w-80', 'bg-base-100', 'shadow-xl' /* , 'h-96' */],
    });
    this.photo = new BaseComponent({
      tagName: 'img',
      classNames: ['object-cover', 'h-52', 'loading', 'loading-spinner', 'loading-lg', 'm-auto'],
    });

    this.infoButton = new BaseComponent({
      tagName: 'a',
      classNames: ['btn', 'btn-product'],
      textContent: 'More info',
    });

    this.cardBody = new BaseComponent({ tagName: 'div', classNames: ['card-body'] });
    this.categories = new BaseComponent({ tagName: 'div', classNames: ['card-actions', 'justify-end'] });

    this.name = new BaseComponent({
      tagName: 'h5',
      classNames: ['card-title', 'text-start', 'm-0', 'justify-between', 'poduct-name'],
    });

    this.description = new BaseComponent({ tagName: 'p', classNames: ['description'] });

    this.priceContainer = new BaseComponent({ tagName: 'div', classNames: ['flex', 'justify-between'] });
    this.price = new BaseComponent({ tagName: 'p', classNames: ['price', 'text-primary'] });
    this.discount = new BaseComponent({ tagName: 'p', classNames: ['discount', 'text-accent', 'text-end'] });
    this.priceContainer.appendChildren([this.price, this.discount]);

    this.cardBody.appendChildren([this.name, this.description, this.priceContainer, this.categories]);
    this.createAddToCartButton();
  }

  public setPhotoAttr(src: string, alt: string): this {
    this.photo.getNode().classList.remove('loading', 'loading-spinner', 'loading-lg', 'm-auto');
    this.photo.setAttributes({ src, alt });
    return this;
  }

  public setCategories(categories: string[] = []): this {
    categories.forEach((item) => {
      const category = new BaseComponent({
        tagName: 'p',
        classNames: [
          'badge',
          'badge-outline',
          'badge-md',
          'grow-0',
          'category-badge',
          'hover:text-white',
          'hover:bg-primary',
        ],
        textContent: item,
      });
      this.categories.append(category);
    });
    return this;
  }

  public createAddToCartButton(): BaseComponent<'button'> {
    const addToCartButton = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-primary', 'rounded-full', 'btn-sm', 'btn_add-to-cart', 'btn_add-cart__active'],
      parentNode: this.categories.getNode(),
    });

    addToCartButton.addListener('click', (e) => {
      e.preventDefault();
      if (!addToCartButton.getNode().classList.contains('btn_add-cart__disabled')) {
        const productId = addToCartButton.getNode().getAttribute('productId');
        addToCartButton.getNode().classList.remove('btn_add-cart__active');
        addToCartButton.getNode().classList.add('btn_add-cart__disabled');
        productId && this.addProductToCard(productId);
      }
    });
    return addToCartButton;
  }

  public displayPrice(price: number, discount?: number): this {
    this.price.setTextContent(`₽${price / 100}`);
    if (discount) {
      this.price.addClass(['line-through', 'opacity-50']);
      this.discount.setTextContent(`₽${discount / 100}`);
      new BaseComponent({
        tagName: 'div',
        classNames: ['badge', 'badge-accent', 'badge-lg'],
        parentNode: this.name.getNode(),
        textContent: 'Sale',
      });
    }
    this.priceContainer.appendChildren([this.price, this.discount]);
    return this;
  }

  public setProductName(name: string): this {
    this.name.setTextContent(name);
    return this;
  }
  public setProductDescription(description: string): this {
    this.description.setTextContent(description);
    return this;
  }

  public addCardId(id: string): void {
    this.card.setAttributes({ id });
    this.infoButton.setAttributes({ href: `/#/product-page/${id}`, 'data-navigo': '' });
  }
  public buildItem(): this {
    this.card.appendChildren([this.photo, this.infoButton, this.cardBody]);
    return this;
  }

  private addProductToCard(productId: string): void {
    const cartId = localStorage.getItem('comforto-cart-id') ?? '';

    getCart(cartId)
      .then(async (data) => {
        const version = data.body.version;
        CartView.cartVersion = version;
        await addProductInCart(cartId, version, productId).then((data) => {
          if (localStorage.getItem('appliedCouponName')) {
            localStorage.setItem('prevPrice', `${data.body.totalPrice.centAmount / 100 + 1000}`);
          }
          this.showAlert();
          CartView.cartVersion = data.body.version;
        });
      })
      .catch(() => {
        createCart([{ productId: productId }])
          .then((data) => {
            saveNewCartId(data);
            this.showAlert();
            CartView.cartVersion = data.body.version;
          })
          .catch(console.log);
      });
  }

  private showAlert(): void {
    const alert = new Alert(true, 'Product add to shopping cart');
    alert.setAlertOnPage();
  }
}
