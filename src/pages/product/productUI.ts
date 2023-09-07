import { Attribute } from '@commercetools/platform-sdk';
import { getCart, getProduct } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { ProductImgSlider } from '@pages/product/productImgSlider';
import { ModalWindow } from '@components/modal/modalWindow';

export default class ProductUI {
  private name: string;
  private description: string;
  private price: number;
  private discount: number;
  private isProductInCart = false;

  constructor() {
    this.name = '';
    this.description = '';
    this.price = 0;
    this.discount = 0;
  }

  public render(parentContainer: HTMLElement, productID: string): void {
    getProduct(productID)
      .then(async (data) => {
        const product = data.body.results[0];
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
            this.isProductInCart = Boolean(data.body.lineItems.find((item) => item.productId === product?.id));
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
    const btnAddCart = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn_add-cart'],
      textContent: this.isProductInCart ? '➖ Remove from cart' : '🛒 Add to cart',
    });
    !this.isProductInCart && btnAddCart.addClass(['btn-primary']);
    productInfo.appendChildren([productTitle, productDescription, prices, btnAddCart]);
    this.addProductAttributes(productInfo, attributesList);
    return productInfo;
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
}
