import BaseComponent from '../../utils/baseComponent';
import { PageIds } from '../../types/types';
import './style.css';

const navButtons = [
  { id: PageIds.MainPage, header: 'Main' },
  { id: PageIds.CatalogPage, header: 'Catalog' },
  { id: PageIds.AboutPage, header: 'About' },
  { id: PageIds.RegistrationPage, header: 'Registration' },
  { id: PageIds.LoginPage, header: 'Login' },
  { id: PageIds.ProductPage, header: 'Product' },
  { id: PageIds.BasketPage, header: 'Basket' },
  { id: PageIds.UserProfilePage, header: 'User Profile' },
];

export default class Header extends BaseComponent {
  constructor() {
    super({
      tagName: 'header',
      classNames: ['header'],
      parentNode: document.body,
    });
  }

  private createNavLinks(): void {
    const navLinks = new BaseComponent({
      tagName: 'nav',
      classNames: ['nav'],
      parentNode: this.getNode(),
    });

    navButtons.forEach((elem) => {
      const navLink = `<a class="nav-link" href="${elem.id}" id="${elem.id}" data-navigo>${elem.header}</a>`;
      navLinks.getNode().innerHTML += navLink;
    });
    this.append(navLinks);
  }

  public render(): void {
    this.createNavLinks();
  }
}
