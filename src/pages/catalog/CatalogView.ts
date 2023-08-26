import BaseComponent from '@utils/baseComponent';
import { CatalogFilters } from './CatalogFilters';
import { getCategories, getProductsSearch } from '@utils/apiRequests';
import { ProductProjection } from '@commercetools/platform-sdk';
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
  private resultFilters: string[] = [];

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
    this.switchPage();
    this.filtersContainer.applyFilterBtn.addListener('click', () => {
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const activeFilters = this.filtersContainer.activeFilters;
    const brand: string[] = [];
    const color: string[] = [];
    const material: string[] = [];
    Object.values(activeFilters).forEach(({ filter, value }) => {
      const val = `"${value}"`;
      switch (filter) {
        case 'Brand':
          brand.push(val);
          break;
        case 'Material':
          material.push(val);
          break;
        case 'Color':
          color.push(val);
          break;
      }
    });
    this.resultFilters = [];
    this.pagination.currentPage = 1;
    this.pagination.maxPage = 2;
    this.pagination.total = CATALOG_CARDS_NUM;
    this.createFilterSting('variants.attributes.Color', color, this.resultFilters);
    this.createFilterSting('variants.attributes.Material', material, this.resultFilters);
    this.createFilterSting('variants.attributes.Brand', brand, this.resultFilters);
    console.log(this.resultFilters, 'result filters');
    this.switchPage(/* this.resultFilters */);
  }

  private createFilterSting(predicat: string, arr: string[], result: string[] = []): string[] {
    if (arr.length > 0) {
      result.push(`${predicat}:${arr.join(',')}`);
    }
    return result;
  }

  private switchPage(/* filters: string[] = [] */): void {
    this.cardItems = [];
    this.drawCardLoaders();
    this.drawCatalogCards((this.pagination.currentPage - 1) * CATALOG_CARDS_NUM, CATALOG_CARDS_NUM /* , filters */);
    this.pagination.pageInfoBtn.setTextContent(`Page ${this.pagination.currentPage}`);
  }

  private drawCardLoaders(): void {
    if (this.pagination.currentPage === 1) {
      this.pagination.prevBtn.getNode().disabled = true;
    }
    const cardNumber = 6;
    /*   const cardNumber = Math.min(6, this.pagination.total - (this.pagination.currentPage - 1) * CATALOG_CARDS_NUM);
    if (this.pagination.currentPage >= this.pagination.maxPage || cardNumber < CATALOG_CARDS_NUM) {
      this.pagination.nextBtn.getNode().disabled = true;
    } */
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

  private drawCatalogCards(offset = 0, limit = CATALOG_CARDS_NUM /* , filters: string[] = [] */): void {
    //   getProducts(offset, limit)
    getProductsSearch(offset, limit, this.resultFilters)
      .then(async (data) => {
        console.log(data);
        this.pagination.total = data.body.total ?? 0;
        this.pagination.maxPage = data.body.total ?? 1;
        const cardNumber = Math.min(6, this.pagination.total - (this.pagination.currentPage - 1) * CATALOG_CARDS_NUM);
        if (this.pagination.currentPage >= this.pagination.maxPage || cardNumber < CATALOG_CARDS_NUM) {
          this.pagination.nextBtn.getNode().disabled = true;
        } else {
          this.pagination.nextBtn.getNode().disabled = false;
        }
        console.log(this.pagination.total, this.pagination.currentPage, this.pagination.maxPage);
        await this.getCategoryNames();
        const results = data.body.results;
        this.createItems(results, this.categoryData);
      })
      .catch(console.log);
  }

  private createItems(results: ProductProjection[], categoryNames: Record<string, string>): void {
    if (results.length >= 1) {
      results.forEach((product, index) => {
        // const product = item.masterData.current;
        const categories: string[] = product.categories.map((data) => categoryNames[data.id] ?? '');
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
