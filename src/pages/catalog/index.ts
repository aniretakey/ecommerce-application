import Page from '@utils/pageTemplate';
import './catalog-style.css';
import { CatalogView } from './CatalogView';

export default class Catalog extends Page {
  constructor() {
    super('catalog');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Catalog');
    const catalogWrapper = new CatalogView();
    this.container.append(title, catalogWrapper.catalogWrapper.getNode());
    return this.container;
  }
}
