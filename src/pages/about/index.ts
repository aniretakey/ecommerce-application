import Page from '@utils/pageTemplate';

export default class About extends Page {
  constructor() {
    super('about');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('About');
    this.container.append(title);
    return this.container;
  }
}
