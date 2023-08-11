import Page from '@utils/pageTemplate';

export default class Basket extends Page {
  constructor() {
    super('basket');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Basket');
    this.container.append(title);
    return this.container;
  }
}
