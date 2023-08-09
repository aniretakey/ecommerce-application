import Header from '@components/header/header';
import BaseComponent from '@utils/baseComponent';
import { router } from '@router/router';

export default class App {
  private static container: HTMLElement = document.body;
  private header: Header;

  constructor() {
    this.header = new Header();
  }

  public run(mainHTML: BaseComponent): void {
    this.header.render();
    document.body.append(mainHTML.getNode());
    router.navigate(`${window.location.hash.slice(2)}`);
  }
}
