import BaseComponent from '@utils/baseComponent';
import { PageIds } from '../../types/types';
import './style.css';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { router } from '@router/router';

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
        e.preventDefault();
        if (router) {
          router.navigate(`/${navLink.getNode().id}`);
        }
      });
      navLinks.append(navLink);
    });
    this.append(navLinks);

    const mainPageLink = safeQuerySelector('#main-page');
    mainPageLink.setAttribute('href', '/');
  }

  public render(): void {
    this.createNavLinks();
  }
}
