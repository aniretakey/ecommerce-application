import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from './CatalogFilters';
import { getCategories, getProducts } from '@utils/apiRequests';
import { Product } from '@commercetools/platform-sdk';
import placeholder from '@assets/logo.png';
import { CatalogCard } from '@pages/catalog/catalogCardTemplate';
import { CatalogPagination } from './CatalogPagination';
import { CATALOG_CARDS_NUM } from '@customTypes/enums';

export class CatalogView {
  public catalogWrapper: BaseComponent<'div'>;
  private filtersContainer: CatalogFilters;
  private catalogCardsWrap: BaseComponent<'div'>;
  private categoryData: Record<string, string> = {};
  private cardItems: CatalogCard[] = [];
  private pagination: CatalogPagination;

  constructor() {
    this.filtersContainer = new CatalogFilters();
    this.catalogWrapper = new BaseComponent({
      tagName: 'div',
      classNames: ['flex', 'flex-col', 'justify-between', 'items-center', 'gap-4'],
    });
    this.catalogCardsWrap = new BaseComponent({
      tagName: 'div',
      classNames: ['catalog__cards-wrap', 'justify-items-center'],
    });
    this.pagination = new CatalogPagination(this.switchPage.bind(this));

    this.catalogWrapper.appendChildren([
      this.filtersContainer.filters,
      this.filtersContainer.activeFiltersContainer,
      this.catalogCardsWrap,
      this.pagination.pagContainer,
    ]);
    //  this.switchPage();
  }

  private switchPage(): void {
    this.cardItems = [];
    this.drawCardLoaders();
    this.drawCatalogCards((this.pagination.currentPage - 1) * CATALOG_CARDS_NUM, CATALOG_CARDS_NUM);
    this.pagination.pageInfoBtn.setTextContent(`Page ${this.pagination.currentPage}`);
  }

  private drawCardLoaders(): void {
    if (this.pagination.currentPage === 1) {
      this.pagination.prevBtn.getNode().disabled = true;
    }
    const cardNumber = Math.min(6, this.pagination.total - (this.pagination.currentPage - 1) * CATALOG_CARDS_NUM);
    if (this.pagination.currentPage >= this.pagination.maxPage || cardNumber < CATALOG_CARDS_NUM) {
      this.pagination.nextBtn.getNode().disabled = true;
    }
    this.catalogCardsWrap.clearInnerHTML();
    for (let i = 0; i < cardNumber; i++) {
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

  private drawCatalogCards(offset = 0, limit = CATALOG_CARDS_NUM): void {
    getProducts(offset, limit)
      .then(async (data) => {
        console.log(data);
        this.pagination.total = data.body.total ?? 0;
        this.pagination.maxPage = data.body.total ?? 1;
        await this.getCategoryNames();
        const results = data.body.results;
        this.createItems(results, this.categoryData);
      })
      .catch(console.log);
  }

  private createItems(results: Product[], categoryNames: Record<string, string>): void {
    if (results.length >= 1) {
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

        this.cardItems[index]
          ?.setProductName(name)
          .setProductDescription(description)
          .setPhotoAttr(imgSrc, name)
          .setCategories(categories)
          .displayPrice(price, discount);
      });
    }
    if (results.length < this.cardItems.length) {
      this.cardItems.slice(results.length).forEach((el) => {
        el.card.destroy();
      });
    }
  }
}
