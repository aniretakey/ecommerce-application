import Page from '@utils/pageTemplate';

export default class Registration extends Page {
  constructor() {
    super('registration');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Registration');
    this.container.append(title);
    return this.container;
  }
}
