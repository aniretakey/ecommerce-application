import BaseComponent from '@utils/baseComponent';
import { PageIds } from '@customTypes/types';
import './style.css';
import { safeQuerySelector } from '@utils/safeQuerySelector';

const navButtons = [
  { id: PageIds.MainPage, header: 'Main' },
  { id: PageIds.CatalogPage, header: 'Catalog' },
  { id: PageIds.AboutPage, header: 'About' },
  { id: PageIds.RegistrationPage, header: 'Registration' },
  { id: PageIds.LoginPage, header: 'Login' },
  // { id: PageIds.ProductPage, header: 'Product' },
  // { id: PageIds.BasketPage, header: 'Basket' },
  // { id: PageIds.UserProfilePage, header: 'User Profile' },
];

export default class Header {
  protected header: BaseComponent<'header'>;

  constructor() {
    this.header = new BaseComponent({
      tagName: 'header',
      classNames: ['header'],
      parentNode: document.body,
    });
  }

  private createNavLinks(): void {
    const navLinks = new BaseComponent({
      tagName: 'nav',
      classNames: ['nav'],
      parentNode: this.header.getNode(),
    });

    navButtons.forEach((elem) => {
      const navLink = new BaseComponent({
        tagName: 'a',
        classNames: ['nav-link'],
        textContent: elem.header,
        attributes: {
          href: `/${elem.id}`,
          id: elem.id,
        },
      });
      navLink.getNode().setAttribute('data-navigo', '');
      navLink.getNode().addEventListener('click', (e) => {
        console.log('start');
        e.preventDefault();
      });
      navLinks.append(navLink);
    });
    this.header.append(navLinks);

    const mainPageLink = safeQuerySelector('#main-page');
    mainPageLink.setAttribute('href', '/');
  }

  public render(): void {
    this.createNavLinks();
  }
}
