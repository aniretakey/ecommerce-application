import Page from '@utils/pageTemplate';
import './catalog-style.css';
import { CatalogView } from './CatalogView';

export default class Catalog extends Page {
  constructor() {
    super('catalog');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Catalog');

    /*   this.getCategoriesArray();
    const catalogWrapper = new BaseComponent({
      tagName: 'div',
      classNames: [ 'catalog-wrapper', 'justify-items-center'],
    });
    getProducts()
      .then((data) => {
        const results = data.body.results;
        this.createItems(results, catalogWrapper);
      })
      .catch(console.log);
    this.container.append(catalogWrapper.getNode());
 */

    const catalogWrapper = new CatalogView();
    this.container.append(title, catalogWrapper.catalogWrapper.getNode());
    return this.container;
  }

  /*  private getCategoriesArray() {
    getCategories().then(console.log).catch(console.error);
  }

  private createItems(results: Product[], catalogWrapper: BaseComponent<'div'>): void {
    if (results.length > 1) {
      results.forEach((item) => {
        //  console.log(item);
        const product = item.masterData.current;
        const name = product.name.ru ?? '';
        const description = product.description?.ru ?? '';
        const categories = ['Furniture', 'Living room', 'Coffee tables'];
        const prices = product.masterVariant.prices ?? [];
        let price = 0;
        let discount;
        if (prices.length) {
          price = prices[0]?.value.centAmount ?? 0;
          discount = prices[0]?.discounted?.value.centAmount;
        }
        const images = product.masterVariant.images ?? [];
        let imgSrc = '';
        if (images.length) {
          imgSrc = images[0]?.url ?? '';
        }
        catalogWrapper
          .getNode()
          .append(new CatalogItem(imgSrc, categories, name, description, price, discount).card.getNode());
      });
    }
  }*/
}
