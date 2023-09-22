import Page from '@utils/pageTemplate';
import { CartView } from './CartView';
import './style.css';

export default class Basket extends Page {
  constructor() {
    super('basket');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Shopping Cart');
    this.container.append(title);
    this.container.append(new CartView().cart.getNode());
    return this.container;
  }
}
