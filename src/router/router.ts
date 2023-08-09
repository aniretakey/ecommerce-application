import Navigo from 'navigo';
import Main from '@pages/main';
import Catalog from '@pages/catalog';
import Registration from '@pages/registration';
import Login from '@pages/login';
import About from '@pages/about';
import Error from '@pages/error';
import BaseComponent from '@utils/baseComponent';

const pagesList = ['main-page', 'catalog-page', 'about-page', 'registration-page', 'login-page'];

function renderNewPage(mainHTML: BaseComponent, newPage: HTMLElement): void {
  mainHTML.clearInnerHTML();
  mainHTML.getNode().append(newPage);
}

export default function routing(mainHTML: BaseComponent): void {
  const router = new Navigo('/', { hash: true, strategy: 'ALL' });
  router.on('', () => {
    const MainPage = new Main().render();
    renderNewPage(mainHTML, MainPage);
  });
  router.on('/catalog-page', () => {
    const CatalogPage = new Catalog().render();
    renderNewPage(mainHTML, CatalogPage);
  });
  router.on('/registration-page', () => {
    const RegistrationPage = new Registration().render();
    renderNewPage(mainHTML, RegistrationPage);
  });
  router.on('/login-page', () => {
    const LoginPage = new Login().render();
    renderNewPage(mainHTML, LoginPage);
  });
  router.on('/about-page', () => {
    const AboutPage = new About().render();
    renderNewPage(mainHTML, AboutPage);
  });
  router.on(`/error-page`, function () {
    const ErrorPage = new Error().render();
    renderNewPage(mainHTML, ErrorPage);
  });

  router.navigate(`${window.location.hash.slice(2)}`);

  window.addEventListener('hashchange', function () {
    console.log('hash was changed');
    const hash = window.location.hash.slice(2);
    if (pagesList.includes(hash)) {
      router.navigate(`/${hash}`);
    } else {
      router.navigate(`/error-page`);
    }
  });
}
