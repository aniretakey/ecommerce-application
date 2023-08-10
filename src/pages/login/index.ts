import Page from '@utils/pageTemplate';

export default class Login extends Page {
  constructor() {
    super('login');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Log In');
    this.container.append(title);
    return this.container;
  }
}
