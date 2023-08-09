import './global.css';
import App from '@app/app';
import BaseComponent from '@utils/baseComponent';
import { mainHTML } from '@router/router';

const app = new App();
if (mainHTML instanceof BaseComponent) {
  app.run(mainHTML);
}
