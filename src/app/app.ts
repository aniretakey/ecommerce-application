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
import UserProfile from '@pages/user-profile';
import ProductPage from '@pages/product';
import { getProducts } from '@utils/apiRequests';

export default class App {
  private static container: HTMLElement = document.body;
  private header: Header;
  private main: Main;
  private router: Navigo;
  private clickedCardKey: string | undefined;
  private pagesList: (string | undefined)[];

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.router = new Navigo('/', { hash: true, strategy: 'ALL' });
    this.clickedCardKey = '';

    this.pagesList = [
      '',
      'catalog-page',
      'about-page',
      'registration-page',
      'login-page',
      'basket-page',
      'profile-page',
    ];

    // eslint-disable-next-line max-lines-per-function
    window.addEventListener('load', () => {
      function renderNewPage(mainHTML: BaseComponent<'main'>, newPage: HTMLElement | string): void {
        mainHTML.clearInnerHTML();
        mainHTML.getNode().append(newPage);
      }

      this.router.on('', () => {
        renderNewPage(this.main.main, '');
        this.main.render();
      });

      this.router.on('/catalog-page', () => {
        const CatalogPage = new Catalog().render();
        CatalogPage.addEventListener('click', (e) => {
          const clickedElem: EventTarget | null = e.target;
          if (clickedElem instanceof HTMLElement && clickedElem?.closest('.card')) {
            this.clickedCardKey = clickedElem?.closest('.card')?.id;
            this.router.navigate(`/product-page/${this.clickedCardKey}`);
            return this.clickedCardKey;
          }
        });
        renderNewPage(this.main.main, CatalogPage);
      });

      this.router.on(
        '/registration-page',
        () => {
          if (this.isAuthorizedUser()) {
            this.router.navigate('/');
          } else {
            const RegistrationPage = new Registration().render();
            renderNewPage(this.main.main, RegistrationPage);
          }
        },
        {
          leave: (done) => {
            if (this.isAuthorizedUser()) {
              this.header.setEndSubListLink(true);
            }
            done();
          },
        },
      );

      this.router.on('/about-page', () => {
        const AboutPage = new About().render();
        renderNewPage(this.main.main, AboutPage);
      });

      this.router.on(
        '/login-page',
        () => {
          if (this.isAuthorizedUser()) {
            this.router.navigate('/');
          } else {
            const LoginPage = new Login().render();
            renderNewPage(this.main.main, LoginPage);
          }
        },
        {
          leave: (done) => {
            if (this.isAuthorizedUser()) {
              this.header.setEndSubListLink(true);
            }
            done();
          },
        },
      );

      this.router.on(`/basket-page`, () => {
        const BasketPage = new Basket().render();
        renderNewPage(this.main.main, BasketPage);
      });

      this.router.on(`/profile-page`, () => {
        if (this.isAuthorizedUser()) {
          const UserProfilePage = new UserProfile().render();
          renderNewPage(this.main.main, UserProfilePage);
        } else {
          this.router.navigate('/');
        }
      });

      this.router.on(`/logout`, () => {
        this.router.navigate('');
      });

      this.router.on(`/error-page`, () => {
        const ErrorPage = new Error().render();
        renderNewPage(this.main.main, ErrorPage);
      });

      window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (!this.pagesList.includes(hash.slice(2))) {
          this.router.navigate('/error-page');
        } else if (hash.includes('product-page')) {
          const productPage = new ProductPage().createPage(hash.slice(15));
          renderNewPage(this.main.main, productPage);
        }
      });

      this.router.resolve();
      this.router.navigate(`${window.location.hash.slice(2)}`);
    });
  }

  private createProductPagesRoutes(offset = 0, limit = 50): void {
    getProducts(offset, limit)
      .then((data) => {
        const keys = data.body.results.map((item) => item.key);
        this.pagesList.push(...keys.map((key) => `product-page/${key}`));

        keys.forEach((key) => {
          this.router.on(`/product-page/${key}`, () => {
            if (key) {
              this.router.link(`/product-page/${key}`);
              if (this.clickedCardKey) {
                const productPage = new ProductPage().createPage(this.clickedCardKey);
                this.main.main.clearInnerHTML();
                this.main.main.getNode().append(productPage);
              }
            }
          });
        });
        return this.pagesList;
      })
      .catch(console.log);
  }

  public run(): void {
    this.header.render(this.isAuthorizedUser());
    this.createProductPagesRoutes(0, 50);
  }

  private isAuthorizedUser(): boolean {
    return Boolean(localStorage.getItem('comforto-access-token'));
  }
}
