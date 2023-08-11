import Page from '@utils/pageTemplate';
import BaseComponent from '@utils/baseComponent';
import './style.css';

export default class Error extends Page {
  constructor() {
    super('error');
  }

  private errorImg = new BaseComponent({
    tagName: 'div',
    classNames: ['error-img'],
  });

  private errorText = new BaseComponent({
    tagName: 'h3',
    classNames: ['error-text'],
    textContent: `You can go back to`,
  });

  public homeLink = new BaseComponent({
    tagName: 'a',
    classNames: ['btn'],
    textContent: 'Home Page',
    attributes: {
      href: '/',
    },
  });

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Hmmm, this page does not exist...');
    this.container.append(title);
    this.container.append(this.errorImg.getNode());
    this.container.append(this.errorText.getNode());
    this.container.append(this.homeLink.getNode());

    return this.container;
  }
}
