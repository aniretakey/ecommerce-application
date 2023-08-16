import Page from '@utils/pageTemplate';

export default class UserProfile extends Page {
  constructor() {
    super('user-profile');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('UserProfile');
    this.container.append(title);
    return this.container;
  }
}
