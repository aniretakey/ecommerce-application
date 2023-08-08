import Navigo from 'navigo';
import Main from '../components/pages/main';
import Catalog from '../components/pages/catalog';
import Registration from '../components/pages/registration';
import Login from '../components/pages/login';
import About from '../components/pages/about';
import BaseComponent from '../utils/baseComponent';

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
  router.navigate(`${window.location.hash.slice(2)}`);

  window.addEventListener('hashchange', function () {
    console.log('hash was changed');
    const hash = window.location.hash.slice(2);
    if (pagesList.includes(hash)) {
      router.navigate(`/${hash}`);
    } else {
      mainHTML.clearInnerHTML();
      console.log('404 - Page is not found');
      router.on(`/$error-page`, function () {
        console.log('error');
      });
    }
  });
}

// TODO: open error page when URL doesn't exist
