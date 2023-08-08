import Header from '../components/header/header';
import BaseComponent from '../utils/baseComponent';
import routing from '../router/router';

export default class App {
  private static container: HTMLElement = document.body;
  private header: Header;

  constructor() {
    this.header = new Header();
  }

  private mainHTML = new BaseComponent({
    tagName: 'main',
    classNames: ['main'],
    attributes: {
      id: 'main',
    },
  });

  public run(): void {
    this.header.render();
    document.body.append(this.mainHTML.getNode());
    routing(this.mainHTML);
  }
}
