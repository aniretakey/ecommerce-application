import Page from '@utils/pageTemplate';
import ProductUI from './productUI';
import './style.css';

export default class ProductPage extends Page {
  constructor() {
    super('product');
  }

  public createPage(productKey: string): HTMLElement {
    new ProductUI().render(this.container);
    console.log(productKey);

    return this.container;
  }
}
