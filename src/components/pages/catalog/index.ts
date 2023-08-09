import Page from '@utils/pageTemplate';

export default class Catalog extends Page {
  constructor() {
    super('catalog');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Catalog');
    this.container.append(title);
    return this.container;
  }
}
