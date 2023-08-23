import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from './CatalogFilters';
import { getCategories, getProducts } from '@utils/apiRequests';
import { Product } from '@commercetools/platform-sdk';
import placeholder from '@assets/logo.png';
import { CatalogCard } from '@pages/catalog/catalogCardTemplate';

export class CatalogView {
  public catalogWrapper: BaseComponent<'div'>;
  private filtersContainer: CatalogFilters;
  private catalogCardsWrap: BaseComponent<'div'>;
  private categoryData: Record<string, string> = {};
  private cardItems: CatalogCard[] = [];
  constructor() {
    this.catalogWrapper = new BaseComponent({
      tagName: 'div',
    });
    this.catalogCardsWrap = new BaseComponent({
      tagName: 'div',
      classNames: ['catalog__cards-wrap', 'justify-items-center'],
    });
    this.filtersContainer = new CatalogFilters();
    this.catalogWrapper.appendChildren([this.filtersContainer.filters, this.catalogCardsWrap]);
    this.draw();
    this.drawCatalogCards();
  }

  private draw(): void {
    for (let i = 0; i < 6; i++) {
      const newItem = new CatalogCard().buildItem();
      this.catalogCardsWrap.getNode().append(newItem.card.getNode());
      this.cardItems.push(newItem);
    }
  }

  private async getCategoryNames(): Promise<void> {
    await getCategories()
      .then((data) => {
        data.body.results.forEach((el) => {
          const {
            id = '',
            name: { ru: category = '' },
          } = el;
          this.categoryData[id] = category;
        });
      })
      .catch(console.log);
  }

  private drawCatalogCards(): void {
    getProducts()
      .then(async (data) => {
        await this.getCategoryNames();
        console.log(this.categoryData, this.categoryData.size);
        const results = data.body.results;
        this.createItems(results, this.categoryData);
      })
      .catch(console.log);
  }

  private createItems(results: Product[], categoryNames: Record<string, string>): void {
    if (results.length > 1) {
      results.forEach((item, index) => {
        const product = item.masterData.current;
        const categories: string[] = item.masterData.current.categories.map((data) => categoryNames[data.id] ?? '');
        const name = product.name.ru ?? '';
        const description = product.description?.ru ?? '';
        const prices = product.masterVariant.prices ?? [];
        let price = 0;
        let discount: number | undefined;
        if (prices.length) {
          price = prices[0]?.value.centAmount ?? 0;
          discount = prices[0]?.discounted?.value.centAmount;
        }
        const images = product.masterVariant.images ?? [];
        let imgSrc = '';
        if (images.length) {
          imgSrc = images[0]?.url ?? `${placeholder}`;
        }
        console.log(this.cardItems[index]);
        this.cardItems[index]
          ?.setProductName(name)
          .setProductDescription(description)
          .setPhotoAttr(imgSrc, name)
          .setCategories(categories)
          .displayPrice(price, discount);
      });
    }
  }
}
