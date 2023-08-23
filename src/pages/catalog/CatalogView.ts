import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from './CatalogFilters';
import { getCategories, getProducts } from '@utils/apiRequests';
import { Product } from '@commercetools/platform-sdk';
import { CatalogItem } from '@utils/catalogItem';
import placeholder from '@assets/logo.png';
type cat = Record<string, string>;

export class CatalogView {
  public catalogWrapper: BaseComponent<'div'>;
  private filtersContainer: CatalogFilters;
  private catalogCardsWrap: BaseComponent<'div'>;
  private categoryData: cat = {}; //= new Map();
  constructor() {
    this.catalogWrapper = new BaseComponent({
      tagName: 'div',
      //classNames: [/* 'grid', 'grid-cols-3', 'grid-rows-8', 'gap-4' */ 'catalog-wrapper', 'justify-items-center'],
    });
    this.catalogCardsWrap = new BaseComponent({
      tagName: 'div',
      classNames: [/* 'grid', 'grid-cols-3', 'grid-rows-8', 'gap-4' */ 'catalog__cards-wrap', 'justify-items-center'],
    });
    this.filtersContainer = new CatalogFilters();
    this.catalogWrapper.appendChildren([this.filtersContainer.filters, this.catalogCardsWrap]);
    this.drawCatalogCards();
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
          //   return [id, category];
        });
      })
      .catch(console.log);

    //   /* const allCategories =  */Object.fromEntries(

    //  );
    //  this.categoryData = allCategories
    //  sessionStorage.setItem('categoriesData', JSON.stringify(allCategories));
    //   return allCategories;
  }

  private drawCatalogCards(): void {
    //  const categoriesData = sessionStorage.getItem('categoriesData');

    getProducts()
      .then(async (data) => {
        //: cat; // = JSON.parse(categoriesData)
        //  if (this.categoryData.size < 1) {
        await this.getCategoryNames();
        //  }
        console.log(this.categoryData, this.categoryData.size);
        //  const categories = categoriesData ? JSON.parse(categoriesData) : await this.getCategoryNames();

        const results = data.body.results;
        this.createItems(results, this.catalogCardsWrap, this.categoryData /* categories */);
      })
      .catch(console.log);
  }

  private createItems(
    results: Product[],
    catalogWrapper: BaseComponent<'div'>,
    categoryNames: Record<string, string>,
  ): void {
    if (results.length > 1) {
      results.forEach((item) => {
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
        catalogWrapper
          .getNode()
          .append(new CatalogItem(imgSrc, categories, name, description, price, discount).card.getNode());
      });
    }
  }
}
