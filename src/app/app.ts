import Header from '@components/header/header';
import BaseComponent from '@utils/baseComponent';
import Navigo from 'navigo';
import Main from '@pages/main';
import Catalog from '@pages/catalog';
import Registration from '@pages/registration';
import Login from '@pages/login';
import About from '@pages/about';
import Error from '@pages/error';
import Basket from '@pages/basket';
import { safeQuerySelector } from '@utils/safeQuerySelector';

const pagesList = ['', 'catalog-page', 'about-page', 'registration-page', 'login-page', 'basket-page'];

export default class App {
  private static container: HTMLElement = document.body;
  private header: Header;
  private main: Main;
  private router: Navigo;

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.router = new Navigo('/', { hash: true, strategy: 'ALL' }); // { hash: true }, strategy: 'ALL'

    // eslint-disable-next-line max-lines-per-function
    window.addEventListener('load', () => {
      function renderNewPage(mainHTML: BaseComponent<'main'>, newPage: HTMLElement | string): void {
        mainHTML.clearInnerHTML();
        mainHTML.getNode().append(newPage);
      }

      this.router.on('', () => {
        renderNewPage(this.main.main, 'main');
      });

      this.router.on('/catalog-page', () => {
        const CatalogPage = new Catalog().render();
        renderNewPage(this.main.main, CatalogPage);
      });

      this.router.on('/registration-page', () => {
        const RegistrationPage = new Registration().render();
        renderNewPage(this.main.main, RegistrationPage);
        const CountryField = safeQuerySelector('.registration__country-container');
        CountryField.setAttribute('data-valid', 'true');
      });

      this.router.on('/about-page', () => {
        const AboutPage = new About().render();
        renderNewPage(this.main.main, AboutPage);
      });

      this.router.on('/login-page', () => {
        const LoginPage = new Login().render();
        renderNewPage(this.main.main, LoginPage);
      });
      this.router.on(`/basket-page`, () => {
        const BasketPage = new Basket().render();
        renderNewPage(this.main.main, BasketPage);
      });
      this.router.on(`/error-page`, () => {
        const ErrorPage = new Error().render();
        renderNewPage(this.main.main, ErrorPage);
      });
      this.router.resolve();
      this.router.navigate(`${window.location.hash.slice(2)}`);
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(2);
      if (!pagesList.includes(hash)) {
        this.router.navigate('/error-page');
      }
    });
  }

  public run(): void {
    this.header.render();
    // document.body.append(this.main);
  }
}
