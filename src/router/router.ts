import Navigo from 'navigo';
import Main from '../components/pages/main';
import Catalog from '../components/pages/catalog';
import Registration from '../components/pages/registration';
import Login from '../components/pages/login';
import About from '../components/pages/about';
import BaseComponent from '../utils/baseComponent';

function renderNewPage(mainHTML: BaseComponent, newPage: HTMLElement): void {
  mainHTML.clearInnerHTML();
  mainHTML.getNode().append(newPage);
}

export default function routing(mainHTML: BaseComponent): void {
  const router = new Navigo('/');

  router.on('/main-page', function () {
    const MainPage = new Main().render();
    renderNewPage(mainHTML, MainPage);
  });

  router.on('/catalog-page', function () {
    const CatalogPage = new Catalog().render();
    renderNewPage(mainHTML, CatalogPage);
  });

  router.on('/registration-page', function () {
    const RegistrationPage = new Registration().render();
    renderNewPage(mainHTML, RegistrationPage);
  });

  router.on('/login-page', function () {
    const LoginPage = new Login().render();
    renderNewPage(mainHTML, LoginPage);
  });

  router.on('/about-page', function () {
    const AboutPage = new About().render();
    renderNewPage(mainHTML, AboutPage);
  });

  router.navigate('/main-page');
}

// TODO: add change page content when add new hash in URL

// window.addEventListener('hashchange', function () {
//   console.log('hash was changed');
//   mainHTML.clearInnerHTML();
//   const hash = window.location.hash;
//   router.navigate(`${hash}`);
// });

// TODO: open error page when URL doesn't exist
