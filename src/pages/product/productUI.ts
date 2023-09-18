import { Attribute, Cart } from '@commercetools/platform-sdk';
import {
  addProductInCart,
  changeLineItemQuantity,
  createCart,
  getCart,
  getProduct,
  saveNewCartId,
} from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { ProductImgSlider } from '@pages/product/productImgSlider';
import { ModalWindow } from '@components/modal/modalWindow';
import { CartView } from '@pages/basket/CartView';
import { Alert } from '@components/alert/Alert';

export default class ProductUI {
  private id: string;
  private name: string;
  private description: string;
  private price: number;
  private discount: number;
  private isProductInCart = false;
  private lineItemId: string | undefined;
  private btnAddCart = new BaseComponent({ tagName: 'button', classNames: ['btn', 'btn_add-cart'] });

  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.price = 0;
    this.discount = 0;
  }

  public render(parentContainer: HTMLElement, productID: string): void {
    getProduct(productID)
      .then(async (data) => {
        const product = data.body.results[0];
        this.id = product?.id ?? '';
        this.name = product?.name.ru ?? '';
        this.description = product?.description?.ru ?? '';

        const prices = product?.masterVariant.prices ?? [];
        if (prices.length) {
          this.price = Number(prices[0]?.value.centAmount.toString().slice(0, -2)) ?? 0;
          this.discount = Number(prices[0]?.discounted?.value.centAmount.toString().slice(0, -2)) ?? 0;
        }

        const attributes = product?.masterVariant.attributes ?? [];
        const productImages = product?.masterVariant.images ?? [];
        const imgLinks = Object.values(productImages).map((img) => img.url);

        const cartId = localStorage.getItem('comforto-cart-id');
        if (cartId) {
          await getCart(cartId).then((data) => {
            this.lineItemId = data.body.lineItems.find((item) => item.productId === this.id)?.id;
            this.isProductInCart = Boolean(this.lineItemId);
          });
        }

        parentContainer.append(
          this.createMarkup(this.name, this.description, this.price, attributes, imgLinks).getNode(),
        );
      })
      .catch(console.log);
  }

  private createMarkup(
    name: string,
    description: string,
    price: number,
    attributesList: Record<string, string> | Attribute[],
    imgLinks: string[],
  ): BaseComponent<'div'> {
    const container = new BaseComponent({
      tagName: 'div',
      classNames: ['product-container'],
    });

    const sliderBox = new BaseComponent({
      tagName: 'div',
      classNames: ['product-slider'],
    });

    const imagesSlider = new ProductImgSlider();
    sliderBox.append(imagesSlider.createSlider(imgLinks));
    sliderBox.addListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest('img')) {
        const modal = new ModalWindow();
        const modalImgSlider = new ProductImgSlider('modal', imagesSlider.currentImageId);
        modal.buildModal(modalImgSlider.createSlider(imgLinks));
        modalImgSlider.setCurrentImage();
      }
    });

    container.append(sliderBox);
    container.append(this.createProductInfo(name, description, price, attributesList, this.discount));
    return container;
  }

  private createProductInfo(
    name: string,
    description: string,
    price: number,
    attributesList: Record<string, string> | Attribute[],
    discount?: number,
  ): BaseComponent<'div'> {
    const productInfo = new BaseComponent({
      tagName: 'div',
      classNames: ['product-info'],
    });
    const productTitle = new BaseComponent({
      tagName: 'h2',
      classNames: ['product-title'],
      textContent: name,
    });
    const productDescription = new BaseComponent({
      tagName: 'p',
      classNames: ['product-description'],
      textContent: description,
    });
    const prices = this.addPrices(price, discount);
    this.setButtonToCardContent();
    this.btnAddCart.addListener('click', () => this.addOrRemoveProductInCart());
    productInfo.appendChildren([productTitle, productDescription, prices, this.btnAddCart]);
    this.addProductAttributes(productInfo, attributesList);
    return productInfo;
  }

  private setButtonToCardContent(): void {
    this.btnAddCart.setTextContent(this.isProductInCart ? '➖ Remove from cart' : '🛒 Add to cart');
    this.isProductInCart
      ? this.btnAddCart.getNode().classList.remove('btn-primary')
      : this.btnAddCart.addClass(['btn-primary']);
  }

  private addPrices(price: number, discount?: number): BaseComponent<'div'> {
    const pricesContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['product-prices'],
    });

    const productPrice = new BaseComponent({
      tagName: 'p',
      classNames: ['product-price', 'text-primary'],
      textContent: `₽ ${price}`,
    });

    if (discount) {
      const productDiscount = new BaseComponent({
        tagName: 'p',
        classNames: ['product-price', 'product-discount', 'text-accent'],
        textContent: `₽ ${discount}`,
      });
      productPrice.addClass(['line-through', 'opacity-50']);
      pricesContainer.append(productDiscount);
    }
    pricesContainer.append(productPrice);
    return pricesContainer;
  }

  private addProductAttributes(
    container: BaseComponent<'div'>,
    attributesList: Record<string, string> | Attribute[],
  ): void {
    const attributesContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['product-attributes'],
    });

    const attributesArr = Object.values(attributesList);
    attributesArr.forEach((attr: Record<string, string>) => {
      const attribute = new BaseComponent({
        tagName: 'p',
        classNames: ['attribute'],
        parentNode: attributesContainer.getNode(),
      });
      attribute.getNode().innerHTML = `<b class="attribute-name">${attr.name}: </b>${attr.value}`;
    });
    container.append(attributesContainer);
  }

  private addOrRemoveProductInCart(): void {
    const cartId = localStorage.getItem('comforto-cart-id') ?? '';
    if (this.isProductInCart) {
      this.lineItemId &&
        changeLineItemQuantity(cartId, this.lineItemId, 0, CartView.cartVersion)
          .then((data) => {
            this.showAlert(false);
            CartView.cartVersion = data.body.version;
            this.isProductInCart = false;
            this.setButtonToCardContent();
          })
          .catch(console.log);
    } else {
      getCart(cartId)
        .then(async (data) => {
          await addProductInCart(cartId, data.body.version, this.id).then((data) => {
            this.showAlert();
            this.updateDataAfterAddProductInCart(data.body);
          });
        })
        .catch(() => {
          createCart([{ productId: this.id }])
            .then((data) => {
              saveNewCartId(data);
              this.showAlert();
              this.updateDataAfterAddProductInCart(data.body);
            })
            .catch(console.log);
        });
    }
  }

  private updateDataAfterAddProductInCart(newData: Cart): void {
    this.lineItemId = newData.lineItems.find((item) => item.productId === this.id)?.id;
    this.isProductInCart = true;
    this.setButtonToCardContent();
    CartView.cartVersion = newData.version;
  }

  private showAlert(isAdding = true): void {
    const alert = new Alert(true, isAdding ? 'Product add to shopping cart' : 'Product remove from shopping cart');
    alert.setAlertOnPage();
  }
}
