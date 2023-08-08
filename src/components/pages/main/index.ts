import Page from '../../../utils/pageTemplate';

export default class Main extends Page {
  constructor() {
    super('main');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Main');
    this.container.append(title);
    return this.container;
  }
}
