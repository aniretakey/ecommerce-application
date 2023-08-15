import BaseComponent from '@utils/baseComponent';
import { PageIds } from '@customTypes/types';
import './style.css';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { renderNavUI, renderBagSVG } from './headerUI';

const endSubListLinks = {
  isAuthorized: [
    { id: PageIds.UserProfilePage, href: PageIds.UserProfilePage, header: 'User Profile' },
    { id: 'logout', href: '', header: 'Logout' },
  ],
  isNotAuthorized: [
    { id: PageIds.RegistrationPage, href: PageIds.RegistrationPage, header: 'Registration' },
    { id: PageIds.LoginPage, href: PageIds.LoginPage, header: 'Login' },
  ],
};

const navButtons = {
  mainList: [
    { id: PageIds.MainPage, href: '', header: 'Main' },
    { id: PageIds.CatalogPage, href: PageIds.CatalogPage, header: 'Catalog' },
    { id: PageIds.AboutPage, href: PageIds.AboutPage, header: 'About' },
  ],
  endList: {
    baskate: [{ id: PageIds.BasketPage, href: PageIds.BasketPage, header: renderBagSVG() }],
    endSubList: endSubListLinks,
  },
};

export default class Header {
  protected header: BaseComponent<'header'>;

  constructor() {
    this.header = new BaseComponent({
      tagName: 'header',
      classNames: ['header'],
      parentNode: document.body,
    });
  }

  private createNav(): void {
    const nav = new BaseComponent({
      tagName: 'nav',
      classNames: ['nav'],
      parentNode: this.header.getNode(),
    });

    nav.getNode().innerHTML = renderNavUI();

    const logoLink = safeQuerySelector('.navbar__link-logo', nav.getNode());
    const startList = safeQuerySelector('.nav__list-start', nav.getNode());
    const centerList = safeQuerySelector('.nav__list-center', nav.getNode());
    const endList = safeQuerySelector('.nav__list-end', nav.getNode());
    const buregerIcon = safeQuerySelector('.dropdown label', nav.getNode());

    logoLink.setAttribute('data-navigo', '');
    logoLink.setAttribute('href', '/');

    navButtons.mainList.forEach((link) => {
      startList.append(this.createNavListItem(link));
    });
    navButtons.mainList.forEach((link) => {
      centerList.append(this.createNavListItem(link));
    });

    navButtons.endList.baskate.forEach((link) => {
      endList.prepend(this.createNavListItem(link));
    });

    this.setEndSubListLink(false);

    buregerIcon.addEventListener('click', () => {
      startList.classList.toggle('hidden');
    });
  }

  public setEndSubListLink(isAuthorizedUser: boolean): void {
    const endSubList = safeQuerySelector('.nav__sublist-end');
    endSubList.innerHTML = '';
    const endSubListLinks = isAuthorizedUser
      ? navButtons.endList.endSubList.isAuthorized
      : navButtons.endList.endSubList.isNotAuthorized;

    endSubListLinks.forEach((link) => {
      endSubList.append(this.createNavListItem(link));
    });
  }

  private createNavListItem(link: { id: string; href: string; header: string }): HTMLLIElement {
    const listItem = document.createElement('li');
    const linkElement = this.createNavLink(link);
    listItem.append(linkElement);
    return listItem;
  }

  private createNavLink(link: { id: string; href: string; header: string }): HTMLAnchorElement {
    const linkElement = new BaseComponent({
      tagName: 'a',
      classNames: ['nav-link'],
      textContent: link.header,
      attributes: {
        href: `/${link.href}`,
        id: link.id,
        'data-navigo': '',
      },
    });
    linkElement.getNode().innerHTML = link.header;
    linkElement.addListener('click', () => {
      const startList = safeQuerySelector('.nav__list-start');
      const endSubList = safeQuerySelector<HTMLDetailsElement>('.nav__list-end > li > details');
      startList.classList.add('hidden');
      if (endSubList.open) {
        endSubList.open = false;
      }
    });
    return linkElement.getNode();
  }

  public render(): void {
    this.createNav();
  }
}
