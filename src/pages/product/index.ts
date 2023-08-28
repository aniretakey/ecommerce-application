import BaseComponent from '@utils/baseComponent';
import Page from '@utils/pageTemplate';

export default class ProductPage extends Page {
  constructor() {
    super('product');
  }

  public createPage(productKey: string): HTMLElement {
    const title = this.createHeaderTitle('Product');
    const productID = new BaseComponent({
      tagName: 'p',
      classNames: ['product-id'],
      textContent: productKey,
    });
    this.container.append(title, productID.getNode());

    return this.container;
  }
}
