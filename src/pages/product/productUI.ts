import { Attribute } from '@commercetools/platform-sdk';
import { getProduct } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';

export default class ProductUI {
  private container: BaseComponent<'div'>;
  private name: string;
  private description: string;
  private price: number;
  private discount: number;

  constructor() {
    this.container = new BaseComponent({
      tagName: 'div',
      classNames: ['product-container'],
    });
    this.name = '';
    this.description = '';
    this.price = 0;
    this.discount = 0;
  }

  public render(parentContainer: HTMLElement): void {
    getProduct('ComfortHaven')
      .then((data): void => {
        const product = data.body.masterData.current;
        this.name = product.name?.ru ?? '';
        this.description = product.description?.ru ?? '';

        const prices = product.masterVariant.prices ?? [];
        if (prices.length) {
          this.price = Number(prices[0]?.value.centAmount.toString().slice(0, -2)) ?? 0;
          this.discount = Number(prices[0]?.discounted?.value.centAmount.toString().slice(0, -2)) ?? 0;
        }

        const attributes = product.masterVariant.attributes ?? [];
        // const productImages = product.masterVariant.images ?? [];

        parentContainer.append(this.createMarkup(this.name, this.description, this.price, attributes).getNode());
      })
      .catch(console.log);
  }

  private createMarkup(
    name: string,
    description: string,
    price: number,
    attributesList: Record<string, string> | Attribute[],
  ): BaseComponent<'div'> {
    const container = new BaseComponent({
      tagName: 'div',
      classNames: ['product-container'],
    });

    const sliderBox = new BaseComponent({
      tagName: 'div',
      classNames: ['product-slider'],
    });
    container.append(sliderBox);
    container.append(this.createProductInfo(name, description, price, attributesList));
    return container;
  }

  private createProductInfo(
    name: string,
    description: string,
    price: number,
    attributesList: Record<string, string> | Attribute[],
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
    const productPrice = new BaseComponent({
      tagName: 'p',
      classNames: ['product-price'],
      textContent: `₽ ${price}`,
    });
    const btnAddCart = new BaseComponent({
      tagName: 'button',
      classNames: ['btn', 'btn-primary', 'btn_add-cart'],
      textContent: '🛒 Add to cart',
    });
    productInfo.appendChildren([productTitle, productDescription, productPrice, btnAddCart]);
    this.addProductAttributes(productInfo, attributesList);
    return productInfo;
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
