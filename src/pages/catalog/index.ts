import { Product } from '@commercetools/platform-sdk';
import { getProducts } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { CatalogItem } from '@utils/catalogItem';
import Page from '@utils/pageTemplate';

export default class Catalog extends Page {
  constructor() {
    super('catalog');
  }

  public render(): HTMLElement {
    const title = this.createHeaderTitle('Catalog');
    this.container.append(title);

    const catalogWrapper = new BaseComponent({
      tagName: 'div',
      classNames: ['grid', 'grid-cols-3', 'grid-rows-8', 'gap-4'],
    });
    getProducts()
      .then((data) => {
        const results = data.body.results;
        this.createItems(results, catalogWrapper);
      })
      .catch(console.log);
    this.container.append(catalogWrapper.getNode());

    return this.container;
  }

  private createItems(results: Product[], catalogWrapper: BaseComponent<'div'>): void {
    if (results.length > 1) {
      results.forEach((item) => {
        const product = item.masterData.current;
        const name = product.name.ru ?? '';
        const description = product.description?.ru ?? '';
        const category = 'Category';
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
          .append(new CatalogItem(imgSrc, category, name, description, price, discount).card.getNode());
      });
    }
  }
}
